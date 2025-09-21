class AdminPanel {
    constructor() {
        console.log('AdminPanel starting...');
        this.coaches = [];
        this.wins = [];
        this.proof_assets = [];
        this.currentSection = 'coaches';
        this.searchTerm = '';
        this.currentGroupBy = 'none';
        
        // Initialize Firebase
        this.db = window.db || firebase.firestore();
        
        this.initializeElements();
        this.bindEvents();
        this.loadAllData();
        
        // Initialize bulk actions bar (hidden by default)
        this.updateBulkActionsBar();
    }

    initializeElements() {
        // Tab buttons
        this.coachesTab = document.getElementById('coachesTab');
        this.winsTab = document.getElementById('winsTab');
        this.settingsTab = document.getElementById('settingsTab');
        
        // Section containers
        this.coachesSection = document.getElementById('coachesSection');
        this.winsSection = document.getElementById('winsSection');
        this.settingsSection = document.getElementById('settingsSection');
        
        // Control containers
        this.coachesControls = document.getElementById('coachesControls');
        this.winsControls = document.getElementById('winsControls');
        
        // Table bodies
        this.coachesTableBody = document.getElementById('coachesTableBody');
        this.winsTableBody = document.getElementById('winsTableBody');
        
        // Other elements
        this.searchInput = document.getElementById('searchInput');
        this.columnToggleBtn = document.getElementById('columnToggleBtn');
        this.closeColumnModalBtn = document.getElementById('closeColumnModal');
        this.applyColumns = document.getElementById('applyColumns');
        this.viewProofWall = document.getElementById('viewProofWall');
        this.addCoachBtn = document.getElementById('addCoachBtn');
        this.addWinBtn = document.getElementById('addWinBtn');
        
        // Wins controls
        this.winsGroupByBtn = document.getElementById('winsGroupByBtn');
        this.winsColumnToggleBtn = document.getElementById('winsColumnToggleBtn');
        
        // Modals
        this.winsColumnModal = document.getElementById('winsColumnModal');
        this.closeWinsColumnModal = document.getElementById('closeWinsColumnModal');
        this.applyWinsColumns = document.getElementById('applyWinsColumns');
        
        this.groupByModal = document.getElementById('groupByModal');
        this.closeGroupByModal = document.getElementById('closeGroupByModal');
        this.applyGroupBy = document.getElementById('applyGroupBy');
        
        // Select all checkboxes
        this.selectAllCoaches = document.getElementById('selectAllCoaches');
        this.selectAllWins = document.getElementById('selectAllWins');
        
        // Bulk actions elements
        this.bulkActionsBar = document.getElementById('bulkActionsBar');
        this.selectedCount = document.getElementById('selectedCount');
        this.bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        this.clearSelectionBtn = document.getElementById('clearSelectionBtn');
        
        // CSV import elements
        this.importCoachesBtn = document.getElementById('importCoachesBtn');
        this.csvImportModal = document.getElementById('csvImportModal');
        this.closeCsvImportModal = document.getElementById('closeCsvImportModal');
        this.csvFileInput = document.getElementById('csvFileInput');
        this.fileDropZone = document.getElementById('fileDropZone');
        this.selectedFileName = document.getElementById('selectedFileName');
        this.importPreview = document.getElementById('importPreview');
        this.previewTable = document.getElementById('previewTable');
        this.confirmImport = document.getElementById('confirmImport');
        this.cancelImport = document.getElementById('cancelImport');
    }

    bindEvents() {
        // Tab switching
        this.coachesTab.addEventListener('click', () => this.switchTab('coaches'));
        this.winsTab.addEventListener('click', () => this.switchTab('wins'));
        this.settingsTab.addEventListener('click', () => this.switchTab('settings'));
        
        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderCurrentSection();
        });
        
        // Column modal
        this.columnToggleBtn.addEventListener('click', () => this.showColumnModal());
        this.closeColumnModalBtn.addEventListener('click', () => this.closeColumnModal());
        this.applyColumns.addEventListener('click', () => this.applyColumnChanges());
        
        // Other buttons
        this.viewProofWall.addEventListener('click', () => window.open('index.html', '_blank'));
        this.addCoachBtn.addEventListener('click', () => this.addCoach());
        this.addWinBtn.addEventListener('click', () => this.addWin());
        
        // Wins controls
        this.winsGroupByBtn.addEventListener('click', () => this.showGroupByModal());
        this.winsColumnToggleBtn.addEventListener('click', () => this.showWinsColumnModal());
        
        // Wins column modal
        this.closeWinsColumnModal.addEventListener('click', () => this.winsColumnModal.classList.remove('show'));
        this.applyWinsColumns.addEventListener('click', () => this.applyWinsColumnChanges());
        
        // Group by modal
        this.closeGroupByModal.addEventListener('click', () => this.groupByModal.classList.remove('show'));
        this.applyGroupBy.addEventListener('click', () => this.applyGroupByChanges());
        
        // Select all checkboxes
        this.selectAllCoaches.addEventListener('change', (e) => this.toggleSelectAll('coaches', e.target.checked));
        this.selectAllWins.addEventListener('change', (e) => this.toggleSelectAll('wins', e.target.checked));
        
        // Bulk actions
        this.bulkDeleteBtn.addEventListener('click', () => this.bulkDeleteCoaches());
        this.clearSelectionBtn.addEventListener('click', () => this.clearSelection());
        
        // CSV import
        this.importCoachesBtn.addEventListener('click', () => this.showCsvImportModal());
        if (this.closeCsvImportModal) {
            this.closeCsvImportModal.addEventListener('click', () => {
                this.csvImportModal.classList.remove('show');
            });
        }
        if (this.cancelImport) {
            this.cancelImport.addEventListener('click', () => {
                this.csvImportModal.classList.remove('show');
            });
        }
        this.csvFileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.confirmImport.addEventListener('click', () => this.importCoaches());
        
        // File drop zone
        this.fileDropZone.addEventListener('click', () => this.csvFileInput.click());
        this.fileDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.fileDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.fileDropZone.addEventListener('drop', (e) => this.handleFileDrop(e));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const columnModal = document.getElementById('columnModal');
            const csvModal = document.getElementById('csvImportModal');
            if (e.target === columnModal) {
                this.closeColumnModal();
            }
            if (e.target === csvModal) {
                csvModal.classList.remove('show');
            }
        });
    }

    switchTab(section) {
        console.log('Switching to:', section);
        
        // Close any open detail views first
        this.closeDetailViews();
        
        // Reset all state to clean state
        this.resetToCleanState();
        
        // Update tab buttons
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.getElementById(section + 'Tab').classList.add('active');
        
        // Update sections
        document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section + 'Section').classList.add('active');
        
        // Show/hide appropriate controls
        this.coachesControls.style.display = 'none';
        this.winsControls.style.display = 'none';
        
        if (section === 'coaches') {
            this.coachesControls.style.display = 'flex';
        } else if (section === 'wins') {
            this.winsControls.style.display = 'flex';
        }
        
        // Update breadcrumb
        document.getElementById('currentSectionTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);
        
        this.currentSection = section;
        this.renderCurrentSection();
    }

    resetToCleanState() {
        // Clear search term
        this.searchTerm = '';
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        // Clear any selected checkboxes
        document.querySelectorAll('.row-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset select all checkboxes
        if (this.selectAllCoaches) {
            this.selectAllCoaches.checked = false;
        }
        if (this.selectAllWins) {
            this.selectAllWins.checked = false;
        }
        
        // Close any open modals
        this.closeColumnModal();
    }

    toggleSelectAll(section, checked) {
        console.log(`Toggling select all for ${section}:`, checked);
        
        let checkboxes;
        if (section === 'coaches') {
            checkboxes = document.querySelectorAll('#coachesSection .row-checkbox');
        } else if (section === 'wins') {
            checkboxes = document.querySelectorAll('#winsSection .row-checkbox');
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        
        // Update bulk actions bar for coaches
        if (section === 'coaches') {
            this.updateBulkActionsBar();
        }
        
        console.log(`Updated ${checkboxes.length} checkboxes for ${section}`);
    }

    closeDetailViews() {
        // Remove any detail pages
        const detailPage = document.getElementById('coachDetailPage');
        if (detailPage) {
            detailPage.remove();
        }
        
        const winDetailPage = document.getElementById('winDetailPage');
        if (winDetailPage) {
            winDetailPage.remove();
        }
        
        // Make sure main content is visible
        const mainContent = document.querySelector('.admin-main');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    async loadAllData() {
        try {
            console.log('Loading all data...');
            await Promise.all([
                this.loadCoaches(),
                this.loadWins(),
                this.loadProofAssets()
            ]);
            console.log('All data loaded');
            this.renderCurrentSection();
        } catch (error) {
            console.error('Error loading data:', error);
            // Use sample data if Firebase fails
            this.coaches = [
                { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', gender: 'Male' },
                { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', gender: 'Female' }
            ];
            this.wins = [
                { id: '1', coach_id: '1', win_title: 'Sample Win 1', win_date: { seconds: Date.now() / 1000 } },
                { id: '2', coach_id: '2', win_title: 'Sample Win 2', win_date: { seconds: Date.now() / 1000 } }
            ];
            this.proof_assets = [];
            this.renderCurrentSection();
        }
    }

    async loadCoaches() {
        try {
            const snapshot = await this.db.collection('coaches').get();
            this.coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Coaches loaded:', this.coaches.length);
        } catch (error) {
            console.error('Error loading coaches:', error);
            throw error;
        }
    }

    async loadWins() {
        try {
            const snapshot = await this.db.collection('wins').orderBy('win_date', 'desc').get();
            this.wins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Wins loaded:', this.wins.length);
        } catch (error) {
            console.error('Error loading wins:', error);
            throw error;
        }
    }

    async loadProofAssets() {
        try {
            const snapshot = await this.db.collection('proof_assets').get();
            this.proof_assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Proof assets loaded:', this.proof_assets.length);
        } catch (error) {
            console.error('Error loading proof assets:', error);
            throw error;
        }
    }

    renderCurrentSection() {
        switch (this.currentSection) {
            case 'coaches':
                this.renderCoachesTable();
                break;
            case 'wins':
                this.renderWinsTable();
                break;
        }
    }

    renderCoachesTable() {
        console.log('Rendering coaches table, count:', this.coaches.length);
        
        if (this.coaches.length === 0) {
            this.coachesTableBody.innerHTML = '<tr><td colspan="4" class="loading">Loading coaches...</td></tr>';
            return;
        }
        
        let data = this.coaches;
        
        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(coach => 
                (coach.first_name + ' ' + coach.last_name).toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        // Apply grouping if selected
        if (this.currentGroupBy !== 'none') {
            data = this.groupCoaches(data, this.currentGroupBy);
        }
        
        if (data.length === 0) {
            this.coachesTableBody.innerHTML = '<tr><td colspan="4" class="loading">No coaches found</td></tr>';
            return;
        }

        // Sort coaches by most recent win (newest first)
        data.sort((a, b) => {
            const aWins = this.wins.filter(win => win.coach_id === a.id);
            const bWins = this.wins.filter(win => win.coach_id === b.id);
            
            // Get most recent win for each coach
            const aMostRecent = aWins.length > 0 ? Math.max(...aWins.map(win => win.win_date?.seconds || 0)) : 0;
            const bMostRecent = bWins.length > 0 ? Math.max(...bWins.map(win => win.win_date?.seconds || 0)) : 0;
            
            // Sort by most recent win (newest first)
            return bMostRecent - aMostRecent;
        });

        // Get visible columns from the table headers
        const visibleColumns = this.getVisibleColumns();

        this.coachesTableBody.innerHTML = data.map(coach => {
            // Handle group headers
            if (coach.isGroupHeader) {
                return `
                <tr class="group-header" style="background-color: #f3f4f6; font-weight: bold;">
                    <td colspan="4" style="padding: 12px 16px; border-bottom: 2px solid #d1d5db;">
                        ${coach.groupKey} (${coach.count} coach${coach.count === 1 ? '' : 'es'})
                    </td>
                </tr>
                `;
            }
            
            const linkedWins = this.wins.filter(win => win.coach_id === coach.id);
            
            // Get most recent win
            const mostRecentWin = linkedWins.length > 0 
                ? linkedWins.reduce((latest, win) => {
                    const winTime = win.win_date?.seconds || 0;
                    const latestTime = latest.win_date?.seconds || 0;
                    return winTime > latestTime ? win : latest;
                })
                : null;
            
            // Build row HTML based on visible columns
            let rowHTML = `
            <tr data-id="${coach.id}" onclick="adminPanel.showCoachDetail('${coach.id}')" style="cursor: pointer;">
                <td class="checkbox-col" onclick="event.stopPropagation()">
                    <input type="checkbox" class="row-checkbox" data-id="${coach.id}">
                </td>`;
            
            // Add columns based on visibility
            if (visibleColumns.includes('name')) {
                rowHTML += `<td class="col-name">${coach.first_name || ''} ${coach.last_name || ''}</td>`;
            }
            if (visibleColumns.includes('wins_count')) {
                rowHTML += `<td class="col-wins-count">${linkedWins.length}</td>`;
            }
            if (visibleColumns.includes('most_recent_win')) {
                rowHTML += `<td class="col-most-recent-win">${mostRecentWin ? this.formatDateShort(mostRecentWin.win_date) : '-'}</td>`;
            }
            if (visibleColumns.includes('email')) {
                rowHTML += `<td class="col-email">${coach.email || '-'}</td>`;
            }
            if (visibleColumns.includes('join_date')) {
                rowHTML += `<td class="col-join-date">${this.formatJoinDate(coach.join_date)}</td>`;
            }
            if (visibleColumns.includes('gender')) {
                rowHTML += `<td class="col-gender">${coach.gender || '-'}</td>`;
            }
            if (visibleColumns.includes('bio')) {
                rowHTML += `<td class="col-bio">${coach.bio ? (coach.bio.length > 50 ? coach.bio.substring(0, 50) + '...' : coach.bio) : '-'}</td>`;
            }
            if (visibleColumns.includes('linkedin')) {
                rowHTML += `<td class="col-linkedin">${coach.linkedin_url ? 'Link' : '-'}</td>`;
            }
            
            rowHTML += `</tr>`;
            return rowHTML;
        }).join('');
        
        // Add event listeners to checkboxes for bulk actions
        setTimeout(() => {
            document.querySelectorAll('#coachesSection .row-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.updateBulkActionsBar());
            });
        }, 100);
    }

    getVisibleColumns() {
        const visibleColumns = [];
        const headers = document.querySelectorAll('#coachesSection th');
        
        headers.forEach(header => {
            // Only include headers that are actually visible (not display: none)
            if (header.style.display !== 'none' && header.offsetParent !== null) {
                const className = header.className;
                if (className.includes('col-name')) visibleColumns.push('name');
                else if (className.includes('col-wins-count')) visibleColumns.push('wins_count');
                else if (className.includes('col-most-recent-win')) visibleColumns.push('most_recent_win');
                else if (className.includes('col-email')) visibleColumns.push('email');
                else if (className.includes('col-join-date')) visibleColumns.push('join_date');
                else if (className.includes('col-gender')) visibleColumns.push('gender');
                else if (className.includes('col-bio')) visibleColumns.push('bio');
                else if (className.includes('col-linkedin')) visibleColumns.push('linkedin');
            }
        });
        
        return visibleColumns;
    }

    groupCoaches(coaches, groupBy) {
        if (groupBy === 'none') return coaches;
        
        const grouped = {};
        coaches.forEach(coach => {
            let groupKey;
            switch (groupBy) {
                case 'gender':
                    groupKey = coach.gender || 'Not Specified';
                    break;
                case 'join_date':
                    groupKey = coach.join_date ? this.formatDate(coach.join_date) : 'No Date';
                    break;
                case 'wins_count':
                    const winsCount = this.wins.filter(win => win.coach_id === coach.id).length;
                    if (winsCount === 0) groupKey = '0 wins';
                    else if (winsCount === 1) groupKey = '1 win';
                    else groupKey = `${winsCount} wins`;
                    break;
                default:
                    groupKey = 'Other';
            }
            
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(coach);
        });
        
        // Convert back to flat array with group headers
        const result = [];
        Object.keys(grouped).sort().forEach(groupKey => {
            result.push({ isGroupHeader: true, groupKey, count: grouped[groupKey].length });
            result.push(...grouped[groupKey]);
        });
        
        return result;
    }

    renderWinsTable() {
        if (this.wins.length === 0) {
            this.winsTableBody.innerHTML = '<tr><td colspan="7" class="loading">No wins found</td></tr>';
            return;
        }
        
        let data = this.wins;
        
        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(win => {
                const coach = this.coaches.find(c => c.id === win.coach_id);
                const coachName = coach ? `${coach.first_name} ${coach.last_name}` : '';
                return win.win_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       coachName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       (win.win_category && win.win_category.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                       (win.win_description && win.win_description.toLowerCase().includes(this.searchTerm.toLowerCase()));
            });
        }
        
        // Apply grouping if selected
        if (this.currentGroupBy !== 'none') {
            data = this.groupWins(data, this.currentGroupBy);
        }
        
        if (data.length === 0) {
            this.winsTableBody.innerHTML = '<tr><td colspan="7" class="loading">No wins found</td></tr>';
            return;
        }
        
        this.winsTableBody.innerHTML = data.map(win => {
            // Handle group headers
            if (win.isGroupHeader) {
                return `
                <tr class="group-header" style="background-color: #f3f4f6; font-weight: bold;">
                    <td colspan="7" style="padding: 12px 16px; border-bottom: 2px solid #d1d5db;">
                        ${win.groupKey} (${win.count} win${win.count === 1 ? '' : 's'})
                    </td>
                </tr>
                `;
            }
            
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'No Coach';
            
            return `
            <tr data-id="${win.id}" onclick="adminPanel.showWinDetail('${win.id}')" style="cursor: pointer;">
                <td class="checkbox-col" onclick="event.stopPropagation()">
                    <input type="checkbox" class="row-checkbox" data-id="${win.id}">
                </td>
                <td class="col-coach" onclick="adminPanel.selectCoachForWin('${win.id}', event)">${coachName}</td>
                <td class="col-title">${win.win_title || 'Untitled'}</td>
                <td class="col-category" style="display: none;">${win.win_category || 'Uncategorized'}</td>
                <td class="col-description" style="display: none;">${win.win_description || 'No description provided'}</td>
                <td class="col-date">${win.win_date ? this.formatDate(win.win_date) : 'No date'}</td>
                <td class="col-created" style="display: none;">${win.created_at ? this.formatDate(win.created_at) : 'Unknown'}</td>
            </tr>
            `;
        }).join('');
        
        // Add event listeners to checkboxes
        setTimeout(() => {
            this.winsTableBody.querySelectorAll('.row-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.updateBulkActionsBar());
            });
        }, 0);
    }

    groupWins(wins, groupBy) {
        if (groupBy === 'none') return wins;
        
        const grouped = {};
        wins.forEach(win => {
            let groupKey;
            switch (groupBy) {
                case 'coach':
                    const coach = this.coaches.find(c => c.id === win.coach_id);
                    groupKey = coach ? `${coach.first_name} ${coach.last_name}` : 'No Coach';
                    break;
                case 'category':
                    groupKey = win.win_category || 'Uncategorized';
                    break;
                case 'date':
                    groupKey = win.win_date ? this.formatDate(win.win_date) : 'No Date';
                    break;
                default:
                    groupKey = 'Other';
            }
            
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(win);
        });
        
        // Convert back to flat array with group headers
        const result = [];
        Object.keys(grouped).sort().forEach(groupKey => {
            result.push({ isGroupHeader: true, groupKey, count: grouped[groupKey].length });
            result.push(...grouped[groupKey]);
        });
        
        return result;
    }


    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    formatJoinDate(timestamp) {
        if (!timestamp) return 'Need to add date';
        const date = new Date(timestamp.seconds * 1000);
        
        // Check if date is before 2000
        if (date.getFullYear() < 2000) {
            return 'Need to add date';
        }
        
        // Format as "9 Sep 2025"
        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    }

    formatDateShort(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    showColumnModal() {
        console.log('Showing column modal');
        const modal = document.getElementById('columnModal');
        if (modal) {
            modal.classList.add('show');
            console.log('Modal shown successfully');
        } else {
            console.error('Modal not found');
        }
    }

    closeColumnModal() {
        console.log('Closing column modal');
        const modal = document.getElementById('columnModal');
        if (modal) {
            modal.classList.remove('show');
            console.log('Modal closed successfully');
        } else {
            console.error('Modal not found');
        }
    }

    applyColumnChanges() {
        console.log('Applying column changes');
        
        // Get all checked checkboxes
        const checkboxes = document.querySelectorAll('#columnModal input[type="checkbox"]');
        const checkedColumns = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const columnName = checkbox.getAttribute('data-column');
                if (columnName) {
                    checkedColumns.push(columnName);
                }
            }
        });
        
        console.log('Selected columns:', checkedColumns);
        
        // Update visible columns based on selection
        this.updateVisibleColumns(checkedColumns);
        
        // Close the modal
        this.closeColumnModal();
        console.log('Modal should be closed now');
    }

    updateVisibleColumns(selectedColumns) {
        // Map column names to their corresponding classes and visibility
        const columnMap = {
            'name': { class: 'col-name', show: selectedColumns.includes('name') },
            'wins_count': { class: 'col-wins-count', show: selectedColumns.includes('wins_count') },
            'most_recent_win': { class: 'col-most-recent-win', show: selectedColumns.includes('most_recent_win') },
            'email': { class: 'col-email', show: selectedColumns.includes('email') },
            'join_date': { class: 'col-join-date', show: selectedColumns.includes('join_date') },
            'gender': { class: 'col-gender', show: selectedColumns.includes('gender') },
            'bio': { class: 'col-bio', show: selectedColumns.includes('bio') },
            'linkedin': { class: 'col-linkedin', show: selectedColumns.includes('linkedin') }
        };

        // Update table headers
        const tableHeaders = document.querySelectorAll('#coachesSection th');
        tableHeaders.forEach(header => {
            const className = header.className;
            // Find matching column by CSS class
            for (const [columnName, config] of Object.entries(columnMap)) {
                if (className.includes(config.class)) {
                    header.style.display = config.show ? 'table-cell' : 'none';
                    break;
                }
            }
        });

        // Update table cells
        const tableRows = document.querySelectorAll('#coachesSection tbody tr');
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index > 0) { // Skip checkbox column
                    const className = cell.className;
                    // Find matching column by CSS class
                    for (const [columnName, config] of Object.entries(columnMap)) {
                        if (className.includes(config.class)) {
                            cell.style.display = config.show ? 'table-cell' : 'none';
                            break;
                        }
                    }
                }
            });
        });

        // Re-render the table to apply changes
        this.renderCoachesTable();
    }

    viewProofWall() {
        console.log('Opening proof wall');
        window.open('index.html', '_blank');
    }

    addCoach() {
        console.log('Add coach clicked');
        alert('Add coach functionality coming soon!');
    }

    showCoachDetail(coachId) {
        console.log('Opening coach detail for:', coachId);
        const coach = this.coaches.find(c => c.id === coachId);
        if (!coach) return;

        // Hide main content
        const mainContent = document.querySelector('.admin-main');
        mainContent.style.display = 'none';
        
        // Create detail page
        const detailPage = document.createElement('div');
        detailPage.id = 'coachDetailPage';
        detailPage.style.cssText = `
            position: fixed;
            top: 0;
            left: 250px;
            width: calc(100% - 250px);
            height: 100%;
            background: white;
            z-index: 1000;
            overflow-y: auto;
            padding: 20px;
        `;
        
        const coachWins = this.wins.filter(win => win.coach_id === coachId);
        
        detailPage.innerHTML = `
            <div style="position: absolute; top: 20px; right: 20px;">
                <button onclick="adminPanel.showMainView()" style="background: #ef4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">
                    ×
                </button>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h1 style="margin: 0; color: #1f2937;">${coach.first_name} ${coach.last_name}</h1>
                <button onclick="adminPanel.editCoach('${coach.id}')" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    ✏️ Edit Coach
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <p><strong>Email:</strong> ${coach.email || 'Not provided'}</p>
                    <p><strong>Gender:</strong> ${coach.gender || 'Not specified'}</p>
                    <p><strong>Join Date:</strong> ${coach.join_date ? this.formatDate(coach.join_date) : 'Not specified'}</p>
                    <p><strong>Phone:</strong> ${coach.phone || 'Not provided'}</p>
                    <p><strong>Website:</strong> ${coach.website ? `<a href="${coach.website}" target="_blank">${coach.website}</a>` : 'Not provided'}</p>
                </div>
                <div>
                    <p><strong>LinkedIn:</strong> ${coach.linkedin_url ? `<a href="${coach.linkedin_url}" target="_blank">${coach.linkedin_url}</a>` : 'Not provided'}</p>
                    <p><strong>Book Call:</strong> ${coach.book_call_url ? `<a href="${coach.book_call_url}" target="_blank">Book a Call</a>` : 'Not provided'}</p>
                    <p><strong>Profile Image:</strong> ${coach.profile_image ? `<a href="${coach.profile_image}" target="_blank">View Image</a>` : 'Not provided'}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1f2937; margin-bottom: 10px;">Bio</h3>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; line-height: 1.6;">${coach.bio || 'No bio provided'}</p>
                </div>
            </div>
            
            <h2 style="margin-bottom: 20px; color: #1f2937;">Wins (${coachWins.length})</h2>
            ${coachWins.length === 0 ? 
                '<p style="color: #6b7280;">No wins found</p>' :
                `
                <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Title</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Category</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Date</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Assets</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${coachWins.map(win => {
                                const linkedAssets = this.proof_assets.filter(asset => asset.win_id === win.id);
                                return `
                                <tr style="border-bottom: 1px solid #f3f4f6; cursor: pointer;" onclick="adminPanel.showWinDetail('${win.id}')">
                                    <td style="padding: 12px 16px; color: #1f2937; font-weight: 500;">${win.win_title || 'Untitled'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${win.win_category || 'Uncategorized'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${this.formatDate(win.win_date)}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${linkedAssets.length} assets</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                `
            }
        `;
        
        document.body.appendChild(detailPage);
    }

    showWinDetail(winId) {
        console.log('Opening win detail for:', winId);
        const win = this.wins.find(w => w.id === winId);
        if (!win) return;

        const coach = this.coaches.find(c => c.id === win.coach_id);
        const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';

        // Hide main content
        const mainContent = document.querySelector('.admin-main');
        mainContent.style.display = 'none';
        
        // Create win detail page
        const detailPage = document.createElement('div');
        detailPage.id = 'winDetailPage';
        detailPage.style.cssText = `
            position: fixed;
            top: 0;
            left: 250px;
            width: calc(100% - 250px);
            height: 100%;
            background: white;
            z-index: 1000;
            overflow-y: auto;
            padding: 20px;
        `;
        
        const linkedAssets = this.proof_assets.filter(asset => asset.win_id === winId);
        
        detailPage.innerHTML = `
            <div style="position: absolute; top: 20px; right: 20px;">
                <button onclick="adminPanel.showMainView()" style="background: #ef4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">
                    ×
                </button>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h1 style="margin: 0; color: #1f2937;">${win.win_title || 'Untitled Win'}</h1>
                <button onclick="adminPanel.editWin('${win.id}')" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    ✏️ Edit Win
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <p><strong>Coach:</strong> ${coachName}</p>
                    <p><strong>Category:</strong> ${win.win_category || 'Uncategorized'}</p>
                    <p><strong>Date:</strong> ${this.formatDate(win.win_date)}</p>
                </div>
                <div>
                    <p><strong>Description:</strong> ${win.win_description || 'No description provided'}</p>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1f2937;">Assets (${linkedAssets.length})</h2>
                <button onclick="adminPanel.showAddAssetModal('${winId}')" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    + Add Asset
                </button>
            </div>
            ${linkedAssets.length === 0 ? 
                '<p style="color: #6b7280;">No assets found</p>' :
                `
                <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Title</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Type</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${linkedAssets.map(asset => `
                                <tr style="border-bottom: 1px solid #f3f4f6;">
                                    <td style="padding: 12px 16px; color: #1f2937; font-weight: 500;">${asset.asset_title || 'Untitled'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${asset.asset_type || 'Unknown'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${asset.asset_url ? `<a href="${asset.asset_url}" target="_blank">View Asset</a>` : 'No URL'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `
            }
        `;
        
        document.body.appendChild(detailPage);
    }

    showAddAssetModal(winId) {
        console.log('Showing add asset modal for win:', winId);
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'addAssetModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Add Asset to Win</h3>
                    <button onclick="adminPanel.closeAddAssetModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <form id="addAssetForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Asset Title *</label>
                        <input type="text" id="assetTitle" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Asset Type *</label>
                        <select id="assetType" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="">Select Type</option>
                            <option value="Video Testimonial">Video Testimonial</option>
                            <option value="Social Post">Social Post</option>
                            <option value="Case Study">Case Study</option>
                            <option value="Written Quote">Written Quote</option>
                            <option value="Image">Image</option>
                            <option value="Document">Document</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Asset URL</label>
                        <input type="url" id="assetUrl" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="https://example.com/asset">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Description</label>
                        <textarea id="assetDescription" rows="3" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Describe the asset..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="adminPanel.closeAddAssetModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Add Asset
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('addAssetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAsset(winId);
        });
    }

    closeAddAssetModal() {
        const modal = document.getElementById('addAssetModal');
        if (modal) {
            modal.remove();
        }
    }

    async addAsset(winId) {
        const title = document.getElementById('assetTitle').value;
        const type = document.getElementById('assetType').value;
        const url = document.getElementById('assetUrl').value;
        const description = document.getElementById('assetDescription').value;
        
        if (!title || !type) {
            alert('Please fill in required fields');
            return;
        }
        
        try {
            const assetData = {
                win_id: winId,
                asset_title: title,
                asset_type: type,
                asset_url: url || '',
                asset_description: description || '',
                created_at: new Date()
            };
            
            await this.db.collection('proof_assets').add(assetData);
            
            // Refresh the data
            await this.loadProofAssets();
            
            // Close modal
            this.closeAddAssetModal();
            
            // Refresh the win detail view
            this.showWinDetail(winId);
            
            console.log('Asset added successfully');
        } catch (error) {
            console.error('Error adding asset:', error);
            alert('Failed to add asset. Please try again.');
        }
    }

    // Bulk Actions Methods
    updateBulkActionsBar() {
        const selectedCheckboxes = document.querySelectorAll('#coachesSection .row-checkbox:checked');
        const count = selectedCheckboxes.length;
        
        console.log('Updating bulk actions bar. Selected count:', count);
        console.log('Bulk actions bar element:', this.bulkActionsBar);
        
        if (count > 0) {
            this.bulkActionsBar.style.display = 'block';
            this.selectedCount.textContent = `${count} coach${count === 1 ? '' : 'es'} selected`;
            console.log('Showing bulk actions bar');
        } else {
            this.bulkActionsBar.style.display = 'none';
            console.log('Hiding bulk actions bar');
        }
    }

    clearSelection() {
        // Uncheck all coach checkboxes
        document.querySelectorAll('#coachesSection .row-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Uncheck select all checkbox
        if (this.selectAllCoaches) {
            this.selectAllCoaches.checked = false;
        }
        
        // Update bulk actions bar (this will hide it since no items are selected)
        this.updateBulkActionsBar();
    }

    async bulkDeleteCoaches() {
        const selectedCheckboxes = document.querySelectorAll('#coachesSection .row-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
        
        if (selectedIds.length === 0) {
            alert('No coaches selected for deletion');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete ${selectedIds.length} coach${selectedIds.length === 1 ? '' : 'es'}? This action cannot be undone.`);
        
        if (!confirmed) return;
        
        try {
            console.log('Deleting coaches:', selectedIds);
            
            // Delete coaches from Firebase
            const deletePromises = selectedIds.map(id => this.db.collection('coaches').doc(id).delete());
            await Promise.all(deletePromises);
            
            // Remove from local array
            this.coaches = this.coaches.filter(coach => !selectedIds.includes(coach.id));
            
            // Re-render the table
            this.renderCoachesTable();
            
            // Clear selection
            this.clearSelection();
            
            console.log('Coaches deleted successfully');
            alert(`${selectedIds.length} coach${selectedIds.length === 1 ? '' : 'es'} deleted successfully`);
            
        } catch (error) {
            console.error('Error deleting coaches:', error);
            alert('Failed to delete coaches. Please try again.');
        }
    }

    // CSV Import Methods
    showCsvImportModal() {
        this.csvImportModal.classList.add('show');
    }


    resetCsvImportModal() {
        if (this.csvFileInput) this.csvFileInput.value = '';
        if (this.selectedFileName) this.selectedFileName.style.display = 'none';
        if (this.importPreview) this.importPreview.style.display = 'none';
        if (this.confirmImport) this.confirmImport.disabled = true;
        if (this.fileDropZone) this.fileDropZone.classList.remove('dragover');
        this.csvData = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        this.fileDropZone.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.fileDropZone.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        this.fileDropZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Please select a CSV file');
            return;
        }

        this.selectedFileName.textContent = `Selected: ${file.name}`;
        this.selectedFileName.style.display = 'block';

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.csvData = this.parseCSV(e.target.result);
                this.showImportPreview();
                this.confirmImport.disabled = false;
            } catch (error) {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file. Please check the format.');
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must have at least a header row and one data row');
        }

        // Parse CSV with proper handling of quoted fields and commas
        const parseCSVLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };

        const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim());
            
            // Skip rows that don't have enough columns
            if (values.length < headers.length) {
                // Pad with empty strings for missing columns
                while (values.length < headers.length) {
                    values.push('');
                }
            }

            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });

            // Only include rows with required fields
            if (row.first_name && row.last_name) {
                data.push(row);
            }
        }

        return data;
    }

    showImportPreview() {
        if (!this.csvData || this.csvData.length === 0) {
            return;
        }

        const previewData = this.csvData.slice(0, 5);
        const headers = Object.keys(previewData[0]);

        let tableHTML = '<table><thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        previewData.forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                tableHTML += `<td>${row[header] || ''}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        this.previewTable.innerHTML = tableHTML;
        this.importPreview.style.display = 'block';
    }

    async importCoaches() {
        if (!this.csvData || this.csvData.length === 0) {
            alert('No data to import');
            return;
        }

        try {
            console.log('Importing coaches:', this.csvData.length);
            
            const batch = this.db.batch();
            const newCoaches = [];

            this.csvData.forEach(coachData => {
                const docRef = this.db.collection('coaches').doc();
                
                // Prepare coach data
                let joinDate = new Date();
                if (coachData.join_date && coachData.join_date.trim()) {
                    const parsedDate = new Date(coachData.join_date);
                    if (!isNaN(parsedDate.getTime())) {
                        joinDate = parsedDate;
                    }
                }

                const coach = {
                    first_name: coachData.first_name || '',
                    last_name: coachData.last_name || '',
                    email: coachData.email || '',
                    bio: coachData.bio || '',
                    profile_image: coachData.profile_image || '',
                    phone: coachData.phone || '',
                    website: coachData.website || '',
                    linkedin_url: coachData.linkedin_url || '',
                    book_call_url: coachData.book_call_url || '',
                    gender: coachData.gender || '',
                    join_date: firebase.firestore.Timestamp.fromDate(joinDate),
                    created_at: firebase.firestore.Timestamp.fromDate(new Date())
                };

                batch.set(docRef, coach);
                newCoaches.push({ id: docRef.id, ...coach });
            });

            await batch.commit();
            
            // Add to local array
            this.coaches.push(...newCoaches);
            
            // Re-render the table
            this.renderCoachesTable();
            
            // Close modal
            this.csvImportModal.classList.remove('show');
            
            console.log('Coaches imported successfully');
            alert(`${this.csvData.length} coach${this.csvData.length === 1 ? '' : 'es'} imported successfully`);
            
        } catch (error) {
            console.error('Error importing coaches:', error);
            alert('Failed to import coaches. Please try again.');
        }
    }

    editCoach(coachId) {
        console.log('Editing coach:', coachId);
        const coach = this.coaches.find(c => c.id === coachId);
        if (!coach) return;

        // Create edit modal
        const modal = document.createElement('div');
        modal.id = 'editCoachModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Edit Coach</h3>
                    <button onclick="adminPanel.closeEditCoachModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <form id="editCoachForm">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">First Name *</label>
                            <input type="text" id="editFirstName" value="${coach.first_name || ''}" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Last Name *</label>
                            <input type="text" id="editLastName" value="${coach.last_name || ''}" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Email</label>
                            <input type="email" id="editEmail" value="${coach.email || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Phone</label>
                            <input type="tel" id="editPhone" value="${coach.phone || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Gender</label>
                            <select id="editGender" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                <option value="">Select Gender</option>
                                <option value="Male" ${coach.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${coach.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${coach.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Join Date</label>
                            <input type="date" id="editJoinDate" value="${coach.join_date ? new Date(coach.join_date.seconds * 1000).toISOString().split('T')[0] : ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Bio</label>
                        <textarea id="editBio" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;">${coach.bio || ''}</textarea>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">LinkedIn URL</label>
                            <input type="url" id="editLinkedin" value="${coach.linkedin_url || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Website</label>
                            <input type="url" id="editWebsite" value="${coach.website || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Book Call URL</label>
                            <input type="url" id="editBookCall" value="${coach.book_call_url || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Profile Image URL</label>
                            <input type="url" id="editProfileImage" value="${coach.profile_image || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="adminPanel.closeEditCoachModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('editCoachForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCoach(coachId);
        });
    }

    closeEditCoachModal() {
        const modal = document.getElementById('editCoachModal');
        if (modal) {
            modal.remove();
        }
    }

    async saveCoach(coachId) {
        const coachData = {
            first_name: document.getElementById('editFirstName').value,
            last_name: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            gender: document.getElementById('editGender').value,
            bio: document.getElementById('editBio').value,
            linkedin_url: document.getElementById('editLinkedin').value,
            website: document.getElementById('editWebsite').value,
            book_call_url: document.getElementById('editBookCall').value,
            profile_image: document.getElementById('editProfileImage').value,
            join_date: document.getElementById('editJoinDate').value ? 
                firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('editJoinDate').value)) : 
                null
        };
        
        try {
            await this.db.collection('coaches').doc(coachId).update(coachData);
            
            // Update local array
            const coachIndex = this.coaches.findIndex(c => c.id === coachId);
            if (coachIndex !== -1) {
                this.coaches[coachIndex] = { ...this.coaches[coachIndex], ...coachData };
            }
            
            // Close modal
            this.closeEditCoachModal();
            
            // Refresh the coach detail view
            this.showCoachDetail(coachId);
            
            console.log('Coach updated successfully');
            alert('Coach updated successfully');
            
        } catch (error) {
            console.error('Error updating coach:', error);
            alert('Failed to update coach. Please try again.');
        }
    }

    selectCoachForWin(winId, event) {
        event.stopPropagation();
        console.log('Selecting coach for win:', winId);
        
        // Create coach selection modal
        const modal = document.createElement('div');
        modal.id = 'selectCoachModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Select Coach</h3>
                    <button onclick="adminPanel.closeSelectCoachModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <input type="text" id="coachSearchInput" placeholder="Search coaches..." style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                </div>
                
                <div id="coachList" style="max-height: 300px; overflow-y: auto;">
                    ${this.coaches.map(coach => `
                        <div class="coach-option" data-coach-id="${coach.id}" style="padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: background-color 0.2s;" onclick="adminPanel.assignCoachToWin('${winId}', '${coach.id}')">
                            <div style="font-weight: 600; color: #1f2937;">${coach.first_name} ${coach.last_name}</div>
                            <div style="font-size: 12px; color: #6b7280;">${coach.email || 'No email'}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button onclick="adminPanel.closeSelectCoachModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add search functionality
        const searchInput = document.getElementById('coachSearchInput');
        const coachList = document.getElementById('coachList');
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const coachOptions = coachList.querySelectorAll('.coach-option');
            
            coachOptions.forEach(option => {
                const coachName = option.querySelector('div').textContent.toLowerCase();
                const coachEmail = option.querySelector('div:last-child').textContent.toLowerCase();
                
                if (coachName.includes(searchTerm) || coachEmail.includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });
        
        // Add hover effects
        coachList.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('coach-option')) {
                e.target.style.backgroundColor = '#f3f4f6';
            }
        });
        
        coachList.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('coach-option')) {
                e.target.style.backgroundColor = 'transparent';
            }
        });
    }

    closeSelectCoachModal() {
        const modal = document.getElementById('selectCoachModal');
        if (modal) {
            modal.remove();
        }
    }

    async assignCoachToWin(winId, coachId) {
        try {
            await this.db.collection('wins').doc(winId).update({
                coach_id: coachId
            });
            
            // Update local array
            const winIndex = this.wins.findIndex(w => w.id === winId);
            if (winIndex !== -1) {
                this.wins[winIndex].coach_id = coachId;
            }
            
            // Close modal
            this.closeSelectCoachModal();
            
            // Re-render the wins table
            this.renderWinsTable();
            
            console.log('Coach assigned to win successfully');
            alert('Coach assigned successfully');
            
        } catch (error) {
            console.error('Error assigning coach to win:', error);
            alert('Failed to assign coach. Please try again.');
        }
    }

    editWin(winId) {
        console.log('Editing win:', winId);
        const win = this.wins.find(w => w.id === winId);
        if (!win) return;

        // Create edit modal
        const modal = document.createElement('div');
        modal.id = 'editWinModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Edit Win</h3>
                    <button onclick="adminPanel.closeEditWinModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <form id="editWinForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Win Title *</label>
                        <input type="text" id="editWinTitle" value="${win.win_title || ''}" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Category</label>
                        <input type="text" id="editWinCategory" value="${win.win_category || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Description</label>
                        <textarea id="editWinDescription" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;">${win.win_description || ''}</textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Coach</label>
                        <select id="editWinCoach" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="">Select Coach</option>
                            ${this.coaches.map(coach => `
                                <option value="${coach.id}" ${win.coach_id === coach.id ? 'selected' : ''}>${coach.first_name} ${coach.last_name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Win Date</label>
                        <input type="date" id="editWinDate" value="${win.win_date ? new Date(win.win_date.seconds * 1000).toISOString().split('T')[0] : ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="adminPanel.closeEditWinModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('editWinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWin(winId);
        });
    }

    closeEditWinModal() {
        const modal = document.getElementById('editWinModal');
        if (modal) {
            modal.remove();
        }
    }

    async saveWin(winId) {
        const winData = {
            win_title: document.getElementById('editWinTitle').value,
            win_category: document.getElementById('editWinCategory').value,
            win_description: document.getElementById('editWinDescription').value,
            coach_id: document.getElementById('editWinCoach').value || null,
            win_date: document.getElementById('editWinDate').value ? 
                firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('editWinDate').value)) : 
                null
        };
        
        try {
            await this.db.collection('wins').doc(winId).update(winData);
            
            // Update local array
            const winIndex = this.wins.findIndex(w => w.id === winId);
            if (winIndex !== -1) {
                this.wins[winIndex] = { ...this.wins[winIndex], ...winData };
            }
            
            // Close modal
            this.closeEditWinModal();
            
            // Refresh the win detail view
            this.showWinDetail(winId);
            
            console.log('Win updated successfully');
            alert('Win updated successfully');
            
        } catch (error) {
            console.error('Error updating win:', error);
            alert('Failed to update win. Please try again.');
        }
    }

    // Add Win functionality
    addWin() {
        console.log('Adding new win');
        // Create add win modal
        const modal = document.createElement('div');
        modal.id = 'addWinModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Add New Win</h3>
                    <button onclick="adminPanel.closeAddWinModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <form id="addWinForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Win Title *</label>
                        <input type="text" id="newWinTitle" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Category</label>
                        <input type="text" id="newWinCategory" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Description</label>
                        <textarea id="newWinDescription" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Coach</label>
                        <select id="newWinCoach" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="">Select Coach</option>
                            ${this.coaches.map(coach => `
                                <option value="${coach.id}">${coach.first_name} ${coach.last_name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Win Date</label>
                        <input type="date" id="newWinDate" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="adminPanel.closeAddWinModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Add Win
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('addWinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewWin();
        });
    }

    closeAddWinModal() {
        const modal = document.getElementById('addWinModal');
        if (modal) {
            modal.remove();
        }
    }

    async saveNewWin() {
        const winData = {
            win_title: document.getElementById('newWinTitle').value,
            win_category: document.getElementById('newWinCategory').value,
            win_description: document.getElementById('newWinDescription').value,
            coach_id: document.getElementById('newWinCoach').value || null,
            win_date: document.getElementById('newWinDate').value ? 
                firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('newWinDate').value)) : 
                null,
            created_at: firebase.firestore.Timestamp.fromDate(new Date())
        };
        
        try {
            const docRef = await this.db.collection('wins').add(winData);
            
            // Add to local array
            this.wins.push({ id: docRef.id, ...winData });
            
            // Close modal
            this.closeAddWinModal();
            
            // Re-render the wins table
            this.renderWinsTable();
            
            console.log('Win added successfully');
            alert('Win added successfully');
            
        } catch (error) {
            console.error('Error adding win:', error);
            alert('Failed to add win. Please try again.');
        }
    }

    // Wins column modal functionality
    showWinsColumnModal() {
        this.winsColumnModal.classList.add('show');
    }

    closeWinsColumnModal() {
        this.winsColumnModal.classList.remove('show');
    }

    applyWinsColumnChanges() {
        const checkboxes = this.winsColumnModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const column = checkbox.dataset.column;
            const header = document.querySelector(`.col-${column}`);
            if (header) {
                header.style.display = checkbox.checked ? 'table-cell' : 'none';
            }
        });
        this.closeWinsColumnModal();
    }

    // Group by functionality
    showGroupByModal() {
        this.groupByModal.classList.add('show');
    }

    closeGroupByModal() {
        this.groupByModal.classList.remove('show');
    }

    applyGroupByChanges() {
        const selectedGroupBy = this.groupByModal.querySelector('input[name="groupBy"]:checked').value;
        this.currentGroupBy = selectedGroupBy;
        this.closeGroupByModal();
        this.renderCurrentSection();
    }

    addCoach() {
        console.log('Adding new coach');
        // Create add coach modal
        const modal = document.createElement('div');
        modal.id = 'addCoachModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Add New Coach</h3>
                    <button onclick="adminPanel.closeAddCoachModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <form id="addCoachForm">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">First Name *</label>
                            <input type="text" id="newFirstName" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Last Name *</label>
                            <input type="text" id="newLastName" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Email</label>
                            <input type="email" id="newEmail" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Phone</label>
                            <input type="tel" id="newPhone" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Gender</label>
                            <select id="newGender" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Join Date</label>
                            <input type="date" id="newJoinDate" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Bio</label>
                        <textarea id="newBio" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">LinkedIn URL</label>
                            <input type="url" id="newLinkedin" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Website</label>
                            <input type="url" id="newWebsite" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Book Call URL</label>
                            <input type="url" id="newBookCall" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Profile Image URL</label>
                            <input type="url" id="newProfileImage" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="adminPanel.closeAddCoachModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Add Coach
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('addCoachForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewCoach();
        });
    }

    closeAddCoachModal() {
        const modal = document.getElementById('addCoachModal');
        if (modal) {
            modal.remove();
        }
    }

    async saveNewCoach() {
        const coachData = {
            first_name: document.getElementById('newFirstName').value,
            last_name: document.getElementById('newLastName').value,
            email: document.getElementById('newEmail').value,
            phone: document.getElementById('newPhone').value,
            gender: document.getElementById('newGender').value,
            bio: document.getElementById('newBio').value,
            linkedin_url: document.getElementById('newLinkedin').value,
            website: document.getElementById('newWebsite').value,
            book_call_url: document.getElementById('newBookCall').value,
            profile_image: document.getElementById('newProfileImage').value,
            join_date: document.getElementById('newJoinDate').value ? 
                firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('newJoinDate').value)) : 
                firebase.firestore.Timestamp.fromDate(new Date()),
            created_at: firebase.firestore.Timestamp.fromDate(new Date())
        };
        
        try {
            const docRef = await this.db.collection('coaches').add(coachData);
            
            // Add to local array
            this.coaches.push({ id: docRef.id, ...coachData });
            
            // Close modal
            this.closeAddCoachModal();
            
            // Re-render the coaches table
            this.renderCoachesTable();
            
            console.log('Coach added successfully');
            alert('Coach added successfully');
            
        } catch (error) {
            console.error('Error adding coach:', error);
            alert('Failed to add coach. Please try again.');
        }
    }

    showMainView() {
        this.closeDetailViews();
        this.resetToCleanState();
        document.getElementById('coachesSection').classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating AdminPanel...');
    window.adminPanel = new AdminPanel();
    console.log('AdminPanel created:', window.adminPanel);
});