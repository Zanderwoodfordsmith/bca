class AdminPanel {
    constructor() {
        console.log('AdminPanel starting...');
        this.coaches = [];
        this.wins = [];
        this.proof_assets = [];
        this.currentSection = 'coaches';
        this.searchTerm = '';
        
        // Initialize Firebase
        this.db = window.db || firebase.firestore();
        
        this.initializeElements();
        this.bindEvents();
        this.loadAllData();
    }

    initializeElements() {
        // Tab buttons
        this.coachesTab = document.getElementById('coachesTab');
        this.winsTab = document.getElementById('winsTab');
        
        // Section containers
        this.coachesSection = document.getElementById('coachesSection');
        this.winsSection = document.getElementById('winsSection');
        
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
        
        // Select all checkboxes
        this.selectAllCoaches = document.getElementById('selectAllCoaches');
        this.selectAllWins = document.getElementById('selectAllWins');
    }

    bindEvents() {
        // Tab switching
        this.coachesTab.addEventListener('click', () => this.switchTab('coaches'));
        this.winsTab.addEventListener('click', () => this.switchTab('wins'));
        
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
        this.viewProofWall.addEventListener('click', () => this.viewProofWall());
        this.addCoachBtn.addEventListener('click', () => this.addCoach());
        
        // Select all checkboxes
        this.selectAllCoaches.addEventListener('change', (e) => this.toggleSelectAll('coaches', e.target.checked));
        this.selectAllWins.addEventListener('change', (e) => this.toggleSelectAll('wins', e.target.checked));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('columnModal');
            if (e.target === modal) {
                this.closeColumnModal();
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

    renderWinsTable() {
        if (this.wins.length === 0) {
            this.winsTableBody.innerHTML = '<tr><td colspan="4" class="loading">No wins found</td></tr>';
            return;
        }
        
        let data = this.wins;
        
        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(win => {
                const coach = this.coaches.find(c => c.id === win.coach_id);
                const coachName = coach ? `${coach.first_name} ${coach.last_name}` : '';
                return win.win_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       coachName.toLowerCase().includes(this.searchTerm.toLowerCase());
            });
        }
        
        if (data.length === 0) {
            this.winsTableBody.innerHTML = '<tr><td colspan="4" class="loading">No wins found</td></tr>';
            return;
        }
        
        this.winsTableBody.innerHTML = data.map(win => {
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
            
            return `
            <tr data-id="${win.id}" onclick="adminPanel.showWinDetail('${win.id}')" style="cursor: pointer;">
                <td class="checkbox-col" onclick="event.stopPropagation()">
                    <input type="checkbox" class="row-checkbox" data-id="${win.id}">
                </td>
                <td class="col-coach">${coachName}</td>
                <td class="col-title">
                    <div class="win-title">${win.win_title || 'Untitled'}</div>
                    <div class="win-category">${win.win_category || 'Uncategorized'}</div>
                    <div class="win-description">${win.win_description || 'No description provided'}</div>
                </td>
                <td class="col-date">${this.formatDate(win.win_date)}</td>
            </tr>
            `;
        }).join('');
    }


    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
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
            
            <h1 style="margin-bottom: 30px; color: #1f2937;">${coach.first_name} ${coach.last_name}</h1>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <p><strong>Email:</strong> ${coach.email || 'Not provided'}</p>
                    <p><strong>Gender:</strong> ${coach.gender || 'Not specified'}</p>
                    <p><strong>Join Date:</strong> ${coach.join_date ? this.formatDate(coach.join_date) : 'Not specified'}</p>
                </div>
                <div>
                    <p><strong>LinkedIn:</strong> ${coach.linkedin_url ? `<a href="${coach.linkedin_url}" target="_blank">${coach.linkedin_url}</a>` : 'Not provided'}</p>
                    <p><strong>Bio:</strong> ${coach.bio || 'Not provided'}</p>
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
            
            <h1 style="margin-bottom: 30px; color: #1f2937;">${win.win_title || 'Untitled Win'}</h1>
            
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