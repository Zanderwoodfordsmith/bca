class AdminPanel {
    constructor() {
        console.log('AdminPanel starting... v2.1');
        this.coaches = [];
        this.wins = [];
        this.proof_assets = [];
        this.media = [];
        
        // Group state management
        this.groupStates = {
            'high': true,
            'medium': true,
            'low': true,
            'none': true
        };
        this.currentSection = 'coaches';
        this.searchTerm = '';
        this.csvData = null;
        this.winsCsvData = null;
        
        // Initialize Firebase
        this.db = window.db || firebase.firestore();
        
        this.initializeElements();
        this.bindEvents();
        this.loadAllData();
        
        // Initialize bulk actions bar (hidden by default)
        this.updateBulkActionsBar();
        console.log('Bulk actions bar initialized');
    }

    initializeElements() {
        // Tab buttons
        this.coachesTab = document.getElementById('coachesTab');
        this.winsTab = document.getElementById('winsTab');
        this.mediaTab = document.getElementById('mediaTab');
        this.settingsTab = document.getElementById('settingsTab');
        
        // Section containers
        this.coachesSection = document.getElementById('coachesSection');
        this.winsSection = document.getElementById('winsSection');
        this.mediaSection = document.getElementById('mediaSection');
        this.settingsSection = document.getElementById('settingsSection');
        
        // Control containers
        this.coachesControls = document.getElementById('coachesControls');
        this.winsControls = document.getElementById('winsControls');
        this.mediaControls = document.getElementById('mediaControls');
        
        // Table bodies
        this.coachesTableBody = document.getElementById('coachesTableBody');
        this.winsTableBody = document.getElementById('winsTableBody');
        this.mediaTableBody = document.getElementById('mediaTableBody');
        
        // Other elements
        this.searchInput = document.getElementById('searchInput');
        this.columnToggleBtn = document.getElementById('columnToggleBtn');
        this.coachesSortSelect = document.getElementById('coachesSortSelect');
        this.closeColumnModalBtn = document.getElementById('closeColumnModal');
        this.applyColumns = document.getElementById('applyColumns');
        this.viewProofWall = document.getElementById('viewProofWall');
        this.addCoachBtn = document.getElementById('addCoachBtn');
        this.addWinBtn = document.getElementById('addWinBtn');
        this.addMediaBtn = document.getElementById('addMediaBtn');
        this.bulkUploadBtn = document.getElementById('bulkUploadBtn');
        
        // Filter elements
        this.toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
        this.coachesFilters = document.getElementById('coachesFilters');
        this.mediaFilters = document.getElementById('mediaFilters');
        this.winsCountFilter = document.getElementById('winsCountFilter');
        this.joinDateFilter = document.getElementById('joinDateFilter');
        this.recentWinFilter = document.getElementById('recentWinFilter');
        this.coachMediaTypeFilter = document.getElementById('coachMediaTypeFilter');
        this.mediaTypeFilter = document.getElementById('mediaTypeFilter');
        this.mediaPlatformFilter = document.getElementById('mediaPlatformFilter');
        this.mediaAssignmentFilter = document.getElementById('mediaAssignmentFilter');
        
        // Wins controls
        this.winsColumnToggleBtn = document.getElementById('winsColumnToggleBtn');
        
        // Modals
        this.winsColumnModal = document.getElementById('winsColumnModal');
        this.closeWinsColumnModal = document.getElementById('closeWinsColumnModal');
        this.applyWinsColumns = document.getElementById('applyWinsColumns');
        
        // Media modals
        this.mediaColumnModal = document.getElementById('mediaColumnModal');
        this.closeMediaColumnModal = document.getElementById('closeMediaColumnModal');
        this.applyMediaColumns = document.getElementById('applyMediaColumns');
        this.addMediaModal = document.getElementById('addMediaModal');
        this.closeAddMediaModal = document.getElementById('closeAddMediaModal');
        this.saveNewMedia = document.getElementById('saveNewMedia');
        this.bulkUploadModal = document.getElementById('bulkUploadModal');
        this.closeBulkUploadModal = document.getElementById('closeBulkUploadModal');
        this.processBulkUpload = document.getElementById('processBulkUpload');
        
        // Win selection modal
        this.winSelectionModal = document.getElementById('winSelectionModal');
        this.closeWinSelectionModal = document.getElementById('closeWinSelectionModal');
        this.winSearchInput = document.getElementById('winSearchInput');
        this.winsList = document.getElementById('winsList');
        this.assignMediaToWin = document.getElementById('assignMediaToWin');
        this.unassignMediaFromWin = document.getElementById('unassignMediaFromWin');
        
        // Edit media modal
        this.editMediaModal = document.getElementById('editMediaModal');
        this.closeEditMediaModal = document.getElementById('closeEditMediaModal');
        this.saveEditMedia = document.getElementById('saveEditMedia');
        this.deleteMedia = document.getElementById('deleteMedia');
        
        // Select all checkboxes
        this.selectAllCoaches = document.getElementById('selectAllCoaches');
        this.selectAllWins = document.getElementById('selectAllWins');
        this.selectAllMedia = document.getElementById('selectAllMedia');
        
        // Bulk actions elements
        this.bulkActionsBar = document.getElementById('bulkActionsBar');
        this.selectedCount = document.getElementById('selectedCount');
        this.bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        this.clearSelectionBtn = document.getElementById('clearSelectionBtn');
        this.bulkDeleteWinsBtn = document.getElementById('bulkDeleteWinsBtn');
        this.bulkUpdatePriorityBtn = document.getElementById('bulkUpdatePriorityBtn');
        this.bulkDeleteMediaBtn = document.getElementById('bulkDeleteMediaBtn');
        
        // Bulk priority update modal elements
        this.bulkPriorityUpdateModal = document.getElementById('bulkPriorityUpdateModal');
        this.closeBulkPriorityModal = document.getElementById('closeBulkPriorityModal');
        this.cancelBulkPriorityUpdate = document.getElementById('cancelBulkPriorityUpdate');
        this.confirmBulkPriorityUpdate = document.getElementById('confirmBulkPriorityUpdate');
        this.bulkPrioritySelect = document.getElementById('bulkPrioritySelect');
        this.bulkPrioritySelectedCount = document.getElementById('bulkPrioritySelectedCount');
        
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
        
        // Wins CSV import elements
        this.importWinsBtn = document.getElementById('importWinsBtn');
        this.winsCsvImportModal = document.getElementById('winsCsvImportModal');
        this.closeWinsCsvImportModal = document.getElementById('closeWinsCsvImportModal');
        this.winsCsvFileInput = document.getElementById('winsCsvFileInput');
        this.winsFileDropZone = document.getElementById('winsFileDropZone');
        this.winsSelectedFileName = document.getElementById('winsSelectedFileName');
        this.winsImportPreview = document.getElementById('winsImportPreview');
        this.winsPreviewTable = document.getElementById('winsPreviewTable');
        this.confirmWinsImport = document.getElementById('confirmWinsImport');
        this.cancelWinsImport = document.getElementById('cancelWinsImport');
    }

    bindEvents() {
        // Tab switching
        this.coachesTab.addEventListener('click', () => this.switchTab('coaches'));
        this.winsTab.addEventListener('click', () => this.switchTab('wins'));
        this.mediaTab.addEventListener('click', () => this.switchTab('media'));
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
        
        // Coaches sorting
        this.coachesSortSelect.addEventListener('change', (e) => this.sortCoaches(e.target.value));
        
        // Filter controls
        this.toggleFiltersBtn.addEventListener('click', () => this.toggleFilters());
        this.winsCountFilter.addEventListener('change', () => this.applyCoachesFilters());
        this.joinDateFilter.addEventListener('change', () => this.applyCoachesFilters());
        this.recentWinFilter.addEventListener('change', () => this.applyCoachesFilters());
        this.coachMediaTypeFilter.addEventListener('change', () => this.applyCoachesFilters());
        
        // Media filters
        this.mediaTypeFilter.addEventListener('change', () => this.applyMediaFilters());
        this.mediaPlatformFilter.addEventListener('change', () => this.applyMediaFilters());
        this.mediaAssignmentFilter.addEventListener('change', () => this.applyMediaFilters());
        
        // Other buttons
        this.viewProofWall.addEventListener('click', () => window.open('index.html', '_blank'));
        this.addCoachBtn.addEventListener('click', () => this.addCoach());
        this.addWinBtn.addEventListener('click', () => this.addWin());
        this.addMediaBtn.addEventListener('click', () => this.addMedia());
        this.bulkUploadBtn.addEventListener('click', () => this.bulkUpload());
        
        // Wins controls
        this.winsColumnToggleBtn.addEventListener('click', () => this.showWinsColumnModal());
        
        // Media controls
        this.mediaColumnToggleBtn = document.getElementById('mediaColumnToggleBtn');
        this.mediaColumnToggleBtn.addEventListener('click', () => this.showMediaColumnModal());
        
        // Wins column modal
        this.closeWinsColumnModal.addEventListener('click', () => this.winsColumnModal.classList.remove('show'));
        this.applyWinsColumns.addEventListener('click', () => this.applyWinsColumnChanges());
        
        // Media column modal
        this.closeMediaColumnModal.addEventListener('click', () => this.mediaColumnModal.classList.remove('show'));
        this.applyMediaColumns.addEventListener('click', () => this.applyMediaColumnChanges());
        
        // Media modals
        this.closeAddMediaModal.addEventListener('click', () => this.addMediaModal.classList.remove('show'));
        this.saveNewMedia.addEventListener('click', () => this.saveNewMediaItem());
        this.closeBulkUploadModal.addEventListener('click', () => this.bulkUploadModal.classList.remove('show'));
        this.processBulkUpload.addEventListener('click', () => this.processBulkImageUpload());
        
        // Win selection modal
        this.closeWinSelectionModal.addEventListener('click', () => this.winSelectionModal.classList.remove('show'));
        this.winSearchInput.addEventListener('input', () => this.filterWinsForSelection());
        this.assignMediaToWin.addEventListener('click', () => this.assignSelectedWinToMedia());
        this.unassignMediaFromWin.addEventListener('click', () => this.unassignMediaFromWinAction());
        
        // Edit media modal
        this.closeEditMediaModal.addEventListener('click', () => this.editMediaModal.classList.remove('show'));
        this.saveEditMedia.addEventListener('click', () => this.saveEditMediaItem());
        this.deleteMedia.addEventListener('click', () => this.deleteMediaItem());
        
        // Select all checkboxes
        this.selectAllCoaches.addEventListener('change', (e) => this.toggleSelectAll('coaches', e.target.checked));
        this.selectAllWins.addEventListener('change', (e) => this.toggleSelectAll('wins', e.target.checked));
        this.selectAllMedia.addEventListener('change', (e) => this.toggleSelectAll('media', e.target.checked));
        
        // Bulk actions
        this.bulkDeleteBtn.addEventListener('click', () => this.bulkDeleteCoaches());
        this.bulkDeleteWinsBtn.addEventListener('click', () => this.bulkDeleteWins());
        this.bulkDeleteMediaBtn.addEventListener('click', () => this.bulkDeleteMedia());
        this.bulkUpdatePriorityBtn.addEventListener('click', () => this.showBulkPriorityUpdateModal());
        this.clearSelectionBtn.addEventListener('click', () => this.clearSelection());
        
        // Bulk priority update modal
        this.closeBulkPriorityModal.addEventListener('click', () => this.bulkPriorityUpdateModal.classList.remove('show'));
        this.cancelBulkPriorityUpdate.addEventListener('click', () => this.bulkPriorityUpdateModal.classList.remove('show'));
        this.confirmBulkPriorityUpdate.addEventListener('click', () => this.bulkUpdatePriority());
        
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
        
        // Wins CSV import
        this.importWinsBtn.addEventListener('click', () => this.showWinsCsvImportModal());
        if (this.closeWinsCsvImportModal) {
            this.closeWinsCsvImportModal.addEventListener('click', () => {
                this.winsCsvImportModal.classList.remove('show');
                this.resetWinsCsvImportModal();
            });
        }
        if (this.cancelWinsImport) {
            this.cancelWinsImport.addEventListener('click', () => {
                this.winsCsvImportModal.classList.remove('show');
                this.resetWinsCsvImportModal();
            });
        }
        this.winsCsvFileInput.addEventListener('change', (e) => this.handleWinsFileSelect(e));
        this.confirmWinsImport.addEventListener('click', () => this.importWins());
        
        // File drop zone
        this.fileDropZone.addEventListener('click', () => this.csvFileInput.click());
        this.fileDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.fileDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.fileDropZone.addEventListener('drop', (e) => this.handleFileDrop(e));
        
        // Wins file drop zone
        this.winsFileDropZone.addEventListener('click', () => this.winsCsvFileInput.click());
        this.winsFileDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.winsFileDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.winsFileDropZone.addEventListener('drop', (e) => this.handleWinsFileDrop(e));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const columnModal = document.getElementById('columnModal');
            const csvModal = document.getElementById('csvImportModal');
            const winsCsvModal = document.getElementById('winsCsvImportModal');
            if (e.target === columnModal) {
                this.closeColumnModal();
            }
            if (e.target === csvModal) {
                csvModal.classList.remove('show');
            }
            if (e.target === winsCsvModal) {
                winsCsvModal.classList.remove('show');
                this.resetWinsCsvImportModal();
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
        this.mediaControls.style.display = 'none';
        
        // Show/hide appropriate filters
        this.coachesFilters.style.display = 'none';
        this.mediaFilters.style.display = 'none';
        
        if (section === 'coaches') {
            this.coachesControls.style.display = 'flex';
        } else if (section === 'wins') {
            this.winsControls.style.display = 'flex';
        } else if (section === 'media') {
            this.mediaControls.style.display = 'flex';
        }
        
        // Update breadcrumb
        document.getElementById('currentSectionTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);
        
        this.currentSection = section;
        console.log('Current section set to:', this.currentSection);
        
        // Refresh data when switching to wins tab to ensure latest data is shown
        if (section === 'wins') {
            this.loadWins().then(() => {
                this.renderCurrentSection();
            }).catch(error => {
                console.error('Error refreshing wins data:', error);
                this.renderCurrentSection(); // Still render with existing data
            });
        } else {
            this.renderCurrentSection();
        }
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
        } else if (section === 'media') {
            checkboxes = document.querySelectorAll('#mediaSection .row-checkbox');
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        
        // Update bulk actions bar for current section
        this.updateBulkActionsBar();
        
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
                this.loadProofAssets(),
                this.loadMedia()
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
            // Load wins without ordering first to avoid index issues with null dates
            const snapshot = await this.db.collection('wins').get();
            this.wins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Sort by date on the client side (newest first, null dates last)
            this.wins.sort((a, b) => {
                const dateA = a.win_date?.toDate ? a.win_date.toDate() : (a.created_at?.toDate ? a.created_at.toDate() : new Date(0));
                const dateB = b.win_date?.toDate ? b.win_date.toDate() : (b.created_at?.toDate ? b.created_at.toDate() : new Date(0));
                return dateB - dateA; // Newest first
            });
            
            console.log('Wins loaded:', this.wins.length);
            console.log('Sample win data:', this.wins[0]); // Log first win for debugging
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
            case 'media':
                this.renderMediaTable();
                break;
        }
    }

    renderCoachesTable(sortedData = null) {
        console.log('Rendering coaches table, count:', this.coaches.length);
        
        if (this.coaches.length === 0) {
            this.coachesTableBody.innerHTML = '<tr><td colspan="4" class="loading">Loading coaches...</td></tr>';
            return;
        }
        
        // Use sorted data if provided, otherwise use original coaches array
        let data = sortedData || this.coaches;
        
        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(coach => 
                (coach.first_name + ' ' + coach.last_name).toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        // Apply advanced filters
        data = this.applyCoachesFilters(data);
        
        // Apply current sort if one is selected
        const currentSort = this.coachesSortSelect ? this.coachesSortSelect.value : '';
        if (currentSort) {
            data = this.applySorting(data, currentSort);
        }
        
        if (data.length === 0) {
            this.coachesTableBody.innerHTML = '<tr><td colspan="4" class="loading">No coaches found</td></tr>';
            return;
        }


        // Get visible columns from the table headers
        const visibleColumns = this.getVisibleColumns();

        this.coachesTableBody.innerHTML = data.map(coach => {
            // Handle group headers
            if (coach.isGroupHeader) {
                return `
                <tr class="group-header">
                    <td colspan="4">
                        ${coach.groupKey} • ${coach.count} coach${coach.count === 1 ? '' : 'es'}
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
            if (visibleColumns.includes('media_count')) {
                const linkedMedia = this.media.filter(media => media.coach_id === coach.id);
                rowHTML += `<td class="col-media-count">${linkedMedia.length}</td>`;
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
                // Remove existing listeners to prevent duplicates
                checkbox.removeEventListener('change', this.updateBulkActionsBar);
                checkbox.addEventListener('change', (e) => {
                    console.log('Coach checkbox changed:', e.target.checked, e.target.getAttribute('data-id'));
                    this.updateBulkActionsBar();
                });
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
                else if (className.includes('col-media-count')) visibleColumns.push('media_count');
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

    sortCoaches(sortOption, dataToSort = null) {
        if (!sortOption) {
            // No sorting - render as normal
            this.renderCurrentSection();
            return;
        }

        console.log('Sorting coaches by:', sortOption);
        
        // Use provided data or default to all coaches
        let sortedCoaches = dataToSort ? [...dataToSort] : [...this.coaches];
        
        switch (sortOption) {
            case 'name-asc':
                sortedCoaches.sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
                
            case 'name-desc':
                sortedCoaches.sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    return nameB.localeCompare(nameA);
                });
                break;
                
            case 'wins-asc':
                sortedCoaches.sort((a, b) => {
                    const winsA = this.wins.filter(win => win.coach_id === a.id).length;
                    const winsB = this.wins.filter(win => win.coach_id === b.id).length;
                    return winsA - winsB;
                });
                break;
                
            case 'wins-desc':
                sortedCoaches.sort((a, b) => {
                    const winsA = this.wins.filter(win => win.coach_id === a.id).length;
                    const winsB = this.wins.filter(win => win.coach_id === b.id).length;
                    return winsB - winsA;
                });
                break;
                
            case 'recent-win-asc':
                sortedCoaches.sort((a, b) => {
                    const recentWinA = this.getMostRecentWinDate(a.id);
                    const recentWinB = this.getMostRecentWinDate(b.id);
                    
                    // Coaches with no wins go to the end
                    if (!recentWinA && !recentWinB) return 0;
                    if (!recentWinA) return 1;
                    if (!recentWinB) return -1;
                    
                    return recentWinA - recentWinB;
                });
                break;
                
            case 'recent-win-desc':
                sortedCoaches.sort((a, b) => {
                    const recentWinA = this.getMostRecentWinDate(a.id);
                    const recentWinB = this.getMostRecentWinDate(b.id);
                    
                    // Coaches with no wins go to the end
                    if (!recentWinA && !recentWinB) return 0;
                    if (!recentWinA) return 1;
                    if (!recentWinB) return -1;
                    
                    return recentWinB - recentWinA;
                });
                break;
        }
        
        // Render with sorted data
        this.renderCoachesTable(sortedCoaches);
    }

    getMostRecentWinDate(coachId) {
        const coachWins = this.wins.filter(win => win.coach_id === coachId);
        if (coachWins.length === 0) return null;
        
        let mostRecent = null;
        coachWins.forEach(win => {
            const winDate = win.win_date?.toDate ? win.win_date.toDate() : (win.created_at?.toDate ? win.created_at.toDate() : new Date(0));
            if (!mostRecent || winDate > mostRecent) {
                mostRecent = winDate;
            }
        });
        
        return mostRecent;
    }

    applySorting(data, sortOption) {
        let sortedData = [...data];
        
        switch (sortOption) {
            case 'name-asc':
                sortedData.sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
                
            case 'name-desc':
                sortedData.sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    return nameB.localeCompare(nameA);
                });
                break;
                
            case 'wins-asc':
                sortedData.sort((a, b) => {
                    const winsA = this.wins.filter(win => win.coach_id === a.id).length;
                    const winsB = this.wins.filter(win => win.coach_id === b.id).length;
                    return winsA - winsB;
                });
                break;
                
            case 'wins-desc':
                sortedData.sort((a, b) => {
                    const winsA = this.wins.filter(win => win.coach_id === a.id).length;
                    const winsB = this.wins.filter(win => win.coach_id === b.id).length;
                    return winsB - winsA;
                });
                break;
                
            case 'recent-win-asc':
                sortedData.sort((a, b) => {
                    const recentWinA = this.getMostRecentWinDate(a.id);
                    const recentWinB = this.getMostRecentWinDate(b.id);
                    
                    // Coaches with no wins go to the end
                    if (!recentWinA && !recentWinB) return 0;
                    if (!recentWinA) return 1;
                    if (!recentWinB) return -1;
                    
                    return recentWinA - recentWinB;
                });
                break;
                
            case 'recent-win-desc':
                sortedData.sort((a, b) => {
                    const recentWinA = this.getMostRecentWinDate(a.id);
                    const recentWinB = this.getMostRecentWinDate(b.id);
                    
                    // Coaches with no wins go to the end
                    if (!recentWinA && !recentWinB) return 0;
                    if (!recentWinA) return 1;
                    if (!recentWinB) return -1;
                    
                    return recentWinB - recentWinA;
                });
                break;
        }
        
        return sortedData;
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
        
        if (data.length === 0) {
            this.winsTableBody.innerHTML = '<tr><td colspan="7" class="loading">No wins found</td></tr>';
            return;
        }

        // Group wins by priority
        const priorityGroups = {
            'high': [],
            'medium': [],
            'low': [],
            'none': []
        };

        // Categorize wins by priority
        data.forEach(win => {
            const priority = (win.priority || '').toLowerCase().trim();
            if (priority === 'high') {
                priorityGroups.high.push(win);
            } else if (priority === 'medium') {
                priorityGroups.medium.push(win);
            } else if (priority === 'low') {
                priorityGroups.low.push(win);
            } else {
                priorityGroups.none.push(win);
            }
        });

        // Create grouped data with headers
        const groupedData = [];
        
        // Add High Priority group
        if (priorityGroups.high.length > 0) {
            groupedData.push({
                isGroupHeader: true,
                groupKey: '🔴 High Priority',
                count: priorityGroups.high.length,
                groupType: 'high'
            });
            groupedData.push(...priorityGroups.high.map(win => ({ ...win, groupType: 'high' })));
            // Add spacer after group content
            groupedData.push({
                isSpacer: true,
                groupType: 'high'
            });
        }
        
        // Add Medium Priority group
        if (priorityGroups.medium.length > 0) {
            groupedData.push({
                isGroupHeader: true,
                groupKey: '🟡 Medium Priority',
                count: priorityGroups.medium.length,
                groupType: 'medium'
            });
            groupedData.push(...priorityGroups.medium.map(win => ({ ...win, groupType: 'medium' })));
            // Add spacer after group content
            groupedData.push({
                isSpacer: true,
                groupType: 'medium'
            });
        }
        
        // Add Low Priority group
        if (priorityGroups.low.length > 0) {
            groupedData.push({
                isGroupHeader: true,
                groupKey: '🟢 Low Priority',
                count: priorityGroups.low.length,
                groupType: 'low'
            });
            groupedData.push(...priorityGroups.low.map(win => ({ ...win, groupType: 'low' })));
            // Add spacer after group content
            groupedData.push({
                isSpacer: true,
                groupType: 'low'
            });
        }
        
        // Add No Priority group
        if (priorityGroups.none.length > 0) {
            groupedData.push({
                isGroupHeader: true,
                groupKey: '⚪ No Priority',
                count: priorityGroups.none.length,
                groupType: 'none'
            });
            groupedData.push(...priorityGroups.none.map(win => ({ ...win, groupType: 'none' })));
            // Add spacer after group content
            groupedData.push({
                isSpacer: true,
                groupType: 'none'
            });
        }
        
        this.winsTableBody.innerHTML = groupedData.map(win => {
            // Handle spacer rows
            if (win.isSpacer) {
                return `
                <tr class="group-spacer" data-group="${win.groupType}">
                    <td class="checkbox-col" style="height: 24px; background: transparent; border: none;"></td>
                    <td colspan="7" style="height: 24px; background: transparent; border: none;"></td>
                </tr>
                `;
            }
            
            // Handle group headers
            if (win.isGroupHeader) {
                const priorityKey = win.groupType;
                const isExpanded = this.groupStates[priorityKey] !== false;
                const toggleIcon = isExpanded ? '▼' : '▶';
                
                return `
                <tr class="group-header" data-group="${priorityKey}" onclick="adminPanel.toggleGroup('${priorityKey}')">
                    <td class="checkbox-col"></td>
                    <td colspan="7">
                        <span class="group-toggle-icon ${!isExpanded ? 'collapsed' : ''}">${toggleIcon}</span>
                        ${win.groupKey} • ${win.count} win${win.count === 1 ? '' : 's'}
                    </td>
                </tr>
                `;
            }
            
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'No Coach';
            
            // Format priority with enhanced color coding and badges
            const priority = win.priority || '';
            let priorityText = '-';
            let priorityColor = '#6b7280'; // default gray color
            let priorityBgColor = '#f3f4f6'; // light gray background
            let priorityBadge = '';
            
            if (priority && priority.trim() !== '') {
                const priorityLower = priority.toLowerCase();
                priorityText = priority.charAt(0).toUpperCase() + priority.slice(1);
                
                if (priorityLower === 'high') {
                    priorityColor = '#dc2626'; // darker red
                    priorityBgColor = '#fef2f2'; // light red background
                    priorityBadge = '🔴'; // red circle emoji
                } else if (priorityLower === 'medium') {
                    priorityColor = '#d97706'; // darker orange
                    priorityBgColor = '#fffbeb'; // light orange background
                    priorityBadge = '🟡'; // yellow circle emoji
                } else if (priorityLower === 'low') {
                    priorityColor = '#059669'; // green
                    priorityBgColor = '#ecfdf5'; // light green background
                    priorityBadge = '🟢'; // green circle emoji
                }
            }
            
            const isExpanded = this.groupStates[win.groupType] !== false;
            const groupContentClass = isExpanded ? 'group-content' : 'group-content collapsed';
            
            return `
            <tr class="${groupContentClass}" data-group="${win.groupType}" data-id="${win.id}">
                <td class="checkbox-col" onclick="event.stopPropagation()">
                    <input type="checkbox" class="row-checkbox" data-id="${win.id}">
                </td>
                <td class="col-title" onclick="adminPanel.showWinDetail('${win.id}')" style="cursor: pointer;">${win.win_title || 'Untitled'}</td>
                <td class="col-coach" onclick="adminPanel.selectCoachForWin('${win.id}', event)">${coachName}</td>
                <td class="col-category">${win.win_category || 'Uncategorized'}</td>
                <td class="col-priority" style="color: ${priorityColor}; font-weight: 500; background-color: ${priorityBgColor}; padding: 8px 12px; border-radius: 6px; text-align: center;">${priorityBadge} ${priorityText}</td>
                <td class="col-description" style="display: none;">${win.win_description || 'No description provided'}</td>
                <td class="col-date">${win.win_date ? this.formatDate(win.win_date) : 'No date'}</td>
                <td class="col-created" style="display: none;">${win.created_at ? this.formatDate(win.created_at) : 'Unknown'}</td>
            </tr>
            `;
        }).join('');
        
        // Add event listeners to checkboxes
        setTimeout(() => {
            this.winsTableBody.querySelectorAll('.row-checkbox').forEach(checkbox => {
                // Remove existing listeners to prevent duplicates
                checkbox.removeEventListener('change', this.updateBulkActionsBar);
                checkbox.addEventListener('change', (e) => {
                    console.log('Win checkbox changed:', e.target.checked, e.target.getAttribute('data-id'));
                    this.updateBulkActionsBar();
                });
            });
        }, 0);
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
            
            <h2 style="margin-bottom: 20px; color: #1f2937; margin-top: 40px;">Media (${this.media.filter(media => media.coach_id === coachId).length})</h2>
            ${this.media.filter(media => media.coach_id === coachId).length === 0 ? 
                '<p style="color: #6b7280;">No media found</p>' :
                `
                <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Title</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Type</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Platform</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Created</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.media.filter(media => media.coach_id === coachId).map(media => {
                                const win = media.win_id ? this.wins.find(w => w.id === media.win_id) : null;
                                return `
                                <tr style="border-bottom: 1px solid #f3f4f6;">
                                    <td style="padding: 12px 16px; color: #1f2937; font-weight: 500;">${media.title || 'Untitled'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${media.type || 'Unknown'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${media.platform || 'Unknown'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${this.formatDate(media.created_at)}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">
                                        <button onclick="adminPanel.showEditMediaModal('${media.id}')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 5px;">
                                            Edit
                                        </button>
                                        ${media.url ? `
                                            <a href="${media.url}" target="_blank" style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; text-decoration: none;">
                                                View
                                            </a>
                                        ` : ''}
                                        ${win ? `
                                            <button onclick="adminPanel.showWinDetail('${win.id}')" style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;">
                                                Win
                                            </button>
                                        ` : ''}
                                    </td>
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
        const linkedMedia = this.media.filter(media => media.win_id === winId);
        
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
                    <p><strong>Media URL:</strong> ${win.media_url ? `<a href="${win.media_url}" target="_blank">View Media</a>` : 'No media URL'}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1f2937; margin-bottom: 10px;">Media Content</h3>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    ${win.media_description ? `<p style="margin: 0; line-height: 1.6;">${win.media_description}</p>` : '<p style="margin: 0; color: #6b7280;">No media content provided</p>'}
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1f2937;">Media Management</h2>
                <button onclick="adminPanel.showEditWinMediaModal('${winId}')" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    ✏️ Edit Media
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
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; margin-top: 40px;">
                <h2 style="margin: 0; color: #1f2937;">Media Items</h2>
                <button onclick="adminPanel.addMediaToWin('${winId}')" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    ➕ Add Media
                </button>
            </div>
            ${linkedMedia.length === 0 ? 
                '<p style="color: #6b7280;">No media items found</p>' :
                `
                <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Title</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Type</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Platform</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Description</th>
                                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${linkedMedia.map(media => `
                                <tr style="border-bottom: 1px solid #f3f4f6;">
                                    <td style="padding: 12px 16px; color: #1f2937; font-weight: 500;">${media.title || 'Untitled'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${media.type || 'Unknown'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${media.platform || 'Unknown'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">${media.description || 'No description'}</td>
                                    <td style="padding: 12px 16px; color: #6b7280;">
                                        ${media.url ? `<a href="${media.url}" target="_blank" style="color: #3b82f6; text-decoration: none;">View</a>` : 'No URL'}
                                    </td>
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

    showMediaDetail(mediaId) {
        console.log('Opening media detail for:', mediaId);
        const media = this.media.find(m => m.id === mediaId);
        if (!media) return;
        const win = media.win_id ? this.wins.find(w => w.id === media.win_id) : null;
        const coach = media.coach_id ? this.coaches.find(c => c.id === media.coach_id) : (win ? this.coaches.find(c => c.id === win.coach_id) : null);

        // Hide main content
        const mainContent = document.querySelector('.admin-main');
        mainContent.style.display = 'none';

        // Create detail page
        const detailPage = document.createElement('div');
        detailPage.id = 'mediaDetailPage';
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

        const isImage = media.type === 'Screenshot' || media.type === 'Image';
        const previewBlock = isImage && media.url ? `<img src="${media.url}" alt="media" style="max-width: 100%; border-radius: 8px; border: 1px solid #e5e7eb;"/>` : (media.url ? `<a href="${media.url}" target="_blank" class="btn btn-primary">Open Media</a>` : '<div style="color:#6b7280;">No preview available</div>');

        detailPage.innerHTML = `
            <div style="position: absolute; top: 20px; right: 20px;">
                <button onclick="adminPanel.showMainView()" style="background: #ef4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h1 style="margin: 0; color: #1f2937;">${media.title || 'Untitled'}</h1>
                <div style="display:flex; gap:8px;">
                    <button onclick="adminPanel.showEditMediaModal('${media.id}')" class="btn btn-primary">Edit</button>
                    <button onclick="adminPanel.deleteMediaItem && adminPanel.deleteMediaItem('${media.id}')" class="btn btn-danger">Delete</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <div style="margin-bottom: 12px; color:#6b7280;">Preview</div>
                    ${previewBlock}
                </div>
                <div>
                    <p><strong>Type:</strong> ${media.type || 'Unknown'}</p>
                    <p><strong>Platform:</strong> ${media.platform || 'Unknown'}</p>
                    <p><strong>Coach:</strong> ${coach ? `${coach.first_name} ${coach.last_name}` : 'No Coach'}</p>
                    <p><strong>Win:</strong> ${win ? `<a href="#" onclick="adminPanel.showWinDetail('${win.id}')">${win.win_title}</a>` : 'Unassigned'}</p>
                    <p><strong>Created:</strong> ${this.formatDate(media.created_at)}</p>
                    ${media.url ? `<p><strong>URL:</strong> <a href="${media.url}" target="_blank">Open</a></p>` : ''}
                </div>
            </div>

            ${media.description ? `
                <div style="margin-bottom: 20px;">
                    <h3 style="color:#1f2937; margin:0 0 10px 0;">Description</h3>
                    <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e5e7eb;">${media.description}</div>
                </div>
            ` : ''}

            ${media.content ? `
                <div style="margin-bottom: 20px;">
                    <h3 style="color:#1f2937; margin:0 0 10px 0;">Content</h3>
                    <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e5e7eb; white-space:pre-wrap;">${media.content}</div>
                </div>
            ` : ''}
        `;

        document.body.appendChild(detailPage);
    }

    showEditWinMediaModal(winId) {
        console.log('Showing edit media modal for win:', winId);
        const win = this.wins.find(w => w.id === winId);
        if (!win) return;

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'editWinMediaModal';
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
                    <h3 style="margin: 0; color: #1f2937;">Edit Win Media</h3>
                    <button onclick="adminPanel.closeEditWinMediaModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <form id="editWinMediaForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media Type *</label>
                        <select id="editMediaType" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="">Select Type</option>
                            <option value="Video" ${win.media_type === 'Video' ? 'selected' : ''}>Video</option>
                            <option value="Written" ${win.media_type === 'Written' ? 'selected' : ''}>Written</option>
                            <option value="Interview" ${win.media_type === 'Interview' ? 'selected' : ''}>Interview</option>
                            <option value="Screenshot" ${win.media_type === 'Screenshot' ? 'selected' : ''}>Screenshot</option>
                            <option value="Image" ${win.media_type === 'Image' ? 'selected' : ''}>Image</option>
                            <option value="Audio" ${win.media_type === 'Audio' ? 'selected' : ''}>Audio</option>
                            <option value="Document" ${win.media_type === 'Document' ? 'selected' : ''}>Document</option>
                            <option value="Other" ${win.media_type === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media URL</label>
                        <input type="url" id="editMediaUrl" value="${win.media_url || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="https://example.com/media">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media Title</label>
                        <input type="text" id="editMediaTitle" value="${win.media_title || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Optional title for the media">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media Description</label>
                        <textarea id="editMediaDescription" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Describe the media content...">${win.media_description || ''}</textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media Format</label>
                        <select id="editMediaFormat" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="">Select Format</option>
                            <option value="MP4" ${win.media_format === 'MP4' ? 'selected' : ''}>MP4</option>
                            <option value="Text" ${win.media_format === 'Text' ? 'selected' : ''}>Text</option>
                            <option value="Image" ${win.media_format === 'Image' ? 'selected' : ''}>Image</option>
                            <option value="PDF" ${win.media_format === 'PDF' ? 'selected' : ''}>PDF</option>
                            <option value="Audio" ${win.media_format === 'Audio' ? 'selected' : ''}>Audio</option>
                            <option value="Other" ${win.media_format === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="adminPanel.closeEditWinMediaModal()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Save Media
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('editWinMediaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWinMedia(winId);
        });
    }

    closeEditWinMediaModal() {
        const modal = document.getElementById('editWinMediaModal');
        if (modal) {
            modal.remove();
        }
    }

    async saveWinMedia(winId) {
        const mediaData = {
            media_type: document.getElementById('editMediaType').value,
            media_url: document.getElementById('editMediaUrl').value,
            media_title: document.getElementById('editMediaTitle').value,
            media_description: document.getElementById('editMediaDescription').value,
            media_format: document.getElementById('editMediaFormat').value
        };
        
        try {
            await this.db.collection('wins').doc(winId).update(mediaData);
            
            // Update local array
            const winIndex = this.wins.findIndex(w => w.id === winId);
            if (winIndex !== -1) {
                this.wins[winIndex] = { ...this.wins[winIndex], ...mediaData };
            }
            
            // Close modal
            this.closeEditWinMediaModal();
            
            // Refresh the win detail view
            this.showWinDetail(winId);
            
            console.log('Win media updated successfully');
            alert('Win media updated successfully');
            
        } catch (error) {
            console.error('Error updating win media:', error);
            alert('Failed to update win media. Please try again.');
        }
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
        // Check for selected items in the current section
        let selectedCheckboxes = [];
        let sectionType = '';
        
        if (this.currentSection === 'coaches') {
            selectedCheckboxes = document.querySelectorAll('#coachesSection .row-checkbox:checked');
            sectionType = 'coaches';
        } else if (this.currentSection === 'wins') {
            selectedCheckboxes = document.querySelectorAll('#winsSection .row-checkbox:checked');
            sectionType = 'wins';
        } else if (this.currentSection === 'media') {
            selectedCheckboxes = document.querySelectorAll('#mediaSection .row-checkbox:checked');
            sectionType = 'media';
        }
        
        const count = selectedCheckboxes.length;
        
        console.log('Updating bulk actions bar. Selected count:', count, 'Section:', sectionType);
        console.log('Bulk actions bar element:', this.bulkActionsBar);
        console.log('Selected checkboxes:', selectedCheckboxes);
        console.log('Current section:', this.currentSection);
        
        if (count > 0) {
            this.bulkActionsBar.style.display = 'block';
            // Fix pluralization - handle "coaches", "wins", and "media" properly
            let singularForm = '';
            if (sectionType === 'coaches') {
                singularForm = count === 1 ? 'coach' : 'coaches';
            } else if (sectionType === 'wins') {
                singularForm = count === 1 ? 'win' : 'wins';
            } else if (sectionType === 'media') {
                singularForm = count === 1 ? 'media item' : 'media items';
            }
            this.selectedCount.textContent = `${count} ${singularForm} selected`;
            
            // Show/hide appropriate bulk action buttons
            if (this.currentSection === 'coaches') {
                this.bulkDeleteBtn.style.display = 'inline-block';
                this.bulkDeleteWinsBtn.style.display = 'none';
                this.bulkDeleteMediaBtn.style.display = 'none';
                this.bulkUpdatePriorityBtn.style.display = 'none';
            } else if (this.currentSection === 'wins') {
                this.bulkDeleteBtn.style.display = 'none';
                this.bulkDeleteWinsBtn.style.display = 'inline-block';
                this.bulkDeleteMediaBtn.style.display = 'none';
                this.bulkUpdatePriorityBtn.style.display = 'inline-block';
            } else if (this.currentSection === 'media') {
                this.bulkDeleteBtn.style.display = 'none';
                this.bulkDeleteWinsBtn.style.display = 'none';
                this.bulkDeleteMediaBtn.style.display = 'inline-block';
                this.bulkUpdatePriorityBtn.style.display = 'none';
            } else {
                this.bulkDeleteBtn.style.display = 'none';
                this.bulkDeleteWinsBtn.style.display = 'none';
                this.bulkDeleteMediaBtn.style.display = 'none';
                this.bulkUpdatePriorityBtn.style.display = 'none';
            }
            
            console.log('Showing bulk actions bar');
        } else {
            this.bulkActionsBar.style.display = 'none';
            this.bulkDeleteBtn.style.display = 'none';
            this.bulkDeleteWinsBtn.style.display = 'none';
            this.bulkDeleteMediaBtn.style.display = 'none';
            this.bulkUpdatePriorityBtn.style.display = 'none';
            console.log('Hiding bulk actions bar');
        }
    }

    clearSelection() {
        // Uncheck all checkboxes in all sections
        document.querySelectorAll('.row-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Uncheck all select all checkboxes
        if (this.selectAllCoaches) {
            this.selectAllCoaches.checked = false;
        }
        if (this.selectAllWins) {
            this.selectAllWins.checked = false;
        }
        if (this.selectAllMedia) {
            this.selectAllMedia.checked = false;
        }
        
        // Update bulk actions bar (this will hide it since no items are selected)
        this.updateBulkActionsBar();
    }

    async bulkDeleteCoaches() {
        console.log('bulkDeleteCoaches called');
        const selectedCheckboxes = document.querySelectorAll('#coachesSection .row-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
        
        console.log('Selected checkboxes:', selectedCheckboxes.length);
        console.log('Selected IDs:', selectedIds);
        
        if (selectedIds.length === 0) {
            alert('No coaches selected for deletion');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete ${selectedIds.length} coach${selectedIds.length === 1 ? '' : 'es'}? This action cannot be undone.`);
        
        if (!confirmed) {
            console.log('Deletion cancelled by user');
            return;
        }
        
        console.log('User confirmed deletion, proceeding...');
        
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

    async bulkDeleteWins() {
        console.log('bulkDeleteWins called');
        const selectedCheckboxes = document.querySelectorAll('#winsSection .row-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
        
        console.log('Selected checkboxes:', selectedCheckboxes.length);
        console.log('Selected IDs:', selectedIds);
        
        if (selectedIds.length === 0) {
            alert('No wins selected for deletion');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete ${selectedIds.length} win${selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.`);
        
        if (!confirmed) {
            console.log('Deletion cancelled by user');
            return;
        }
        
        console.log('User confirmed deletion, proceeding...');
        
        try {
            console.log('Deleting wins:', selectedIds);
            
            // Delete wins from Firebase
            const deletePromises = selectedIds.map(id => this.db.collection('wins').doc(id).delete());
            await Promise.all(deletePromises);
            
            // Remove from local array
            this.wins = this.wins.filter(win => !selectedIds.includes(win.id));
            
            // Re-render the table
            this.renderWinsTable();
            
            // Clear selection
            this.clearSelection();
            
            console.log('Wins deleted successfully');
            alert(`${selectedIds.length} win${selectedIds.length === 1 ? '' : 's'} deleted successfully`);
            
        } catch (error) {
            console.error('Error deleting wins:', error);
            alert('Failed to delete wins. Please try again.');
        }
    }

    async bulkDeleteMedia() {
        console.log('bulkDeleteMedia called');
        const selectedCheckboxes = document.querySelectorAll('#mediaSection .row-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
        
        console.log('Selected checkboxes:', selectedCheckboxes.length);
        console.log('Selected IDs:', selectedIds);
        
        if (selectedIds.length === 0) {
            alert('No media selected for deletion');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete ${selectedIds.length} media item${selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.`);
        
        if (!confirmed) {
            console.log('Deletion cancelled by user');
            return;
        }
        
        console.log('User confirmed deletion, proceeding...');
        
        try {
            console.log('Deleting media:', selectedIds);
            
            // Delete media from Firebase
            const deletePromises = selectedIds.map(id => db.collection('media').doc(id).delete());
            await Promise.all(deletePromises);
            
            // Remove from local array
            this.media = this.media.filter(media => !selectedIds.includes(media.id));
            
            // Re-render the table
            this.renderMediaTable();
            
            // Clear selection
            this.clearSelection();
            
            console.log('Media deleted successfully');
            alert(`${selectedIds.length} media item${selectedIds.length === 1 ? '' : 's'} deleted successfully`);
            
        } catch (error) {
            console.error('Error deleting media:', error);
            alert('Failed to delete media. Please try again.');
        }
    }

    showBulkPriorityUpdateModal() {
        const selectedCheckboxes = document.querySelectorAll('#winsSection .row-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
        
        if (selectedIds.length === 0) {
            alert('No wins selected for priority update');
            return;
        }
        
        // Update the selected count display
        this.bulkPrioritySelectedCount.textContent = `${selectedIds.length} win${selectedIds.length === 1 ? '' : 's'} selected`;
        
        // Reset the priority select
        this.bulkPrioritySelect.value = '';
        
        // Show the modal
        this.bulkPriorityUpdateModal.classList.add('show');
    }

    async bulkUpdatePriority() {
        const selectedCheckboxes = document.querySelectorAll('#winsSection .row-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-id'));
        const newPriority = this.bulkPrioritySelect.value;
        
        if (selectedIds.length === 0) {
            alert('No wins selected for priority update');
            return;
        }
        
        try {
            console.log('Updating priority for wins:', selectedIds, 'to priority:', newPriority);
            
            // Update wins in Firebase
            const updatePromises = selectedIds.map(id => 
                this.db.collection('wins').doc(id).update({ priority: newPriority })
            );
            await Promise.all(updatePromises);
            
            // Update local array
            selectedIds.forEach(id => {
                const winIndex = this.wins.findIndex(win => win.id === id);
                if (winIndex !== -1) {
                    this.wins[winIndex].priority = newPriority;
                }
            });
            
            // Re-render the table
            this.renderWinsTable();
            
            // Clear selection
            this.clearSelection();
            
            // Close modal
            this.bulkPriorityUpdateModal.classList.remove('show');
            
            console.log('Priority updated successfully');
            alert(`${selectedIds.length} win${selectedIds.length === 1 ? '' : 's'} priority updated successfully`);
            
        } catch (error) {
            console.error('Error updating priority:', error);
            alert('Failed to update priority. Please try again.');
        }
    }

    toggleGroup(groupType) {
        // Toggle the group state
        this.groupStates[groupType] = !this.groupStates[groupType];
        
        // Update the group header icon
        const groupHeader = document.querySelector(`[data-group="${groupType}"].group-header`);
        if (groupHeader) {
            const toggleIcon = groupHeader.querySelector('.group-toggle-icon');
            if (this.groupStates[groupType]) {
                toggleIcon.textContent = '▼';
                toggleIcon.classList.remove('collapsed');
            } else {
                toggleIcon.textContent = '▶';
                toggleIcon.classList.add('collapsed');
            }
        }
        
        // Show/hide group content rows and spacer
        const groupContentRows = document.querySelectorAll(`[data-group="${groupType}"].group-content`);
        const groupSpacer = document.querySelector(`[data-group="${groupType}"].group-spacer`);
        
        groupContentRows.forEach(row => {
            if (this.groupStates[groupType]) {
                row.classList.remove('collapsed');
            } else {
                row.classList.add('collapsed');
            }
        });
        
        if (groupSpacer) {
            if (this.groupStates[groupType]) {
                groupSpacer.classList.remove('collapsed');
            } else {
                groupSpacer.classList.add('collapsed');
            }
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

    resetWinsCsvImportModal() {
        if (this.winsCsvFileInput) this.winsCsvFileInput.value = '';
        if (this.winsSelectedFileName) this.winsSelectedFileName.style.display = 'none';
        if (this.winsImportPreview) this.winsImportPreview.style.display = 'none';
        if (this.confirmWinsImport) this.confirmWinsImport.disabled = true;
        if (this.winsFileDropZone) this.winsFileDropZone.classList.remove('dragover');
        this.winsCsvData = null;
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

    // Wins CSV Import Methods
    showWinsCsvImportModal() {
        this.winsCsvImportModal.classList.add('show');
    }

    handleWinsFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.winsSelectedFileName.textContent = file.name;
            this.winsSelectedFileName.style.display = 'block';
            this.parseWinsCsvFile(file);
        }
    }

    handleWinsFileDrop(e) {
        e.preventDefault();
        this.winsFileDropZone.style.borderColor = '#d1d5db';
        this.winsFileDropZone.style.backgroundColor = '#f9fafb';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                this.winsCsvFileInput.files = files;
                this.winsSelectedFileName.textContent = file.name;
                this.winsSelectedFileName.style.display = 'block';
                this.parseWinsCsvFile(file);
            } else {
                alert('Please select a CSV file.');
            }
        }
    }

    parseWinsCsvFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target.result;
                const lines = csvText.split('\n').filter(line => line.trim());
                
                if (lines.length < 2) {
                    alert('CSV file must have at least a header row and one data row.');
                    return;
                }
                
                // Improved CSV parsing to handle quoted fields properly
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
                
                const headers = parseCSVLine(lines[0]);
                const data = [];
                
                console.log('CSV Headers:', headers);
                
                for (let i = 1; i < lines.length; i++) {
                    const values = parseCSVLine(lines[i]);
                    const row = {};
                    
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });
                    
                    console.log('Parsed row:', row);
                    data.push(row);
                }
                
                this.winsCsvData = data;
                console.log('Parsed CSV data:', data);
                this.showWinsImportPreview(data);
                this.confirmWinsImport.disabled = false;
                
            } catch (error) {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file. Please check the format.');
            }
        };
        reader.readAsText(file);
    }

    showWinsImportPreview(data) {
        const headers = Object.keys(data[0] || {});
        let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
        
        // Header row
        tableHTML += '<thead><tr style="background: #f3f4f6;">';
        headers.forEach(header => {
            tableHTML += `<th style="padding: 8px; border: 1px solid #d1d5db; text-align: left;">${header}</th>`;
        });
        tableHTML += '</tr></thead>';
        
        // Data rows (first 5)
        tableHTML += '<tbody>';
        data.slice(0, 5).forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                const value = row[header] || '';
                tableHTML += `<td style="padding: 8px; border: 1px solid #d1d5db;">${value}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';
        
        if (data.length > 5) {
            tableHTML += `<p style="margin-top: 10px; color: #6b7280;">... and ${data.length - 5} more rows</p>`;
        }
        
        this.winsPreviewTable.innerHTML = tableHTML;
        this.winsImportPreview.style.display = 'block';
    }

    async importWins() {
        if (!this.winsCsvData || this.winsCsvData.length === 0) {
            alert('No data to import');
            return;
        }

        try {
            console.log('Importing wins:', this.winsCsvData.length);
            
            const batch = this.db.batch();
            const newWins = [];
            let importedCount = 0;
            let skippedCount = 0;

            for (const winData of this.winsCsvData) {
                // Skip if no title (required field)
                if (!winData.win_title || winData.win_title.trim() === '') {
                    skippedCount++;
                    continue;
                }

                // Debug log to see what data we're processing
                console.log('Processing win data:', winData);

                // Find coach by name (optional)
                let coachId = null;
                const coachName = winData.coach_name || '';
                
                if (coachName.trim() !== '') {
                    console.log(`Looking for coach: "${coachName}"`);
                    console.log(`Available coaches:`, this.coaches.map(c => `${c.first_name} ${c.last_name}`));
                    
                    const coach = this.coaches.find(c => {
                        const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
                        const match = fullName === coachName.toLowerCase();
                        if (match) {
                            console.log(`✅ Found coach match: "${fullName}" = "${coachName.toLowerCase()}"`);
                        }
                        return match;
                    });
                    
                    if (coach) {
                        coachId = coach.id;
                        console.log(`✅ Coach assigned: ${coach.first_name} ${coach.last_name} (ID: ${coachId})`);
                    } else {
                        console.log(`❌ Coach not found: "${coachName}" - will import win without coach assignment`);
                    }
                } else {
                    console.log(`⚠️ No coach name provided for win: "${winData.win_title}"`);
                }

                const docRef = this.db.collection('wins').doc();
                
                // Prepare win data - only set date if provided
                let winDate = null;
                if (winData.win_date && winData.win_date.trim()) {
                    const parsedDate = new Date(winData.win_date);
                    if (!isNaN(parsedDate.getTime())) {
                        winDate = parsedDate;
                    }
                }

                // Handle priority - use what's in CSV or empty string if blank
                let priority = '';
                if (winData.priority && winData.priority.trim() !== '') {
                    priority = winData.priority.trim();
                }

                // Validate and set win status
                let winStatus = 'pending'; // default
                if (winData.win_status && ['verified', 'pending', 'rejected'].includes(winData.win_status.toLowerCase())) {
                    winStatus = winData.win_status.toLowerCase();
                }

                const win = {
                    win_title: winData.win_title.trim(),
                    win_description: winData.win_description || '',
                    win_category: winData.win_category || '',
                    coach_id: coachId,
                    show_on_wall: winData.show_on_wall !== 'false' && winData.show_on_wall !== false, // Default to true
                    priority: priority,
                    win_status: winStatus,
                    created_at: firebase.firestore.Timestamp.fromDate(new Date())
                };

                // Only add win_date if it was provided
                if (winDate) {
                    win.win_date = firebase.firestore.Timestamp.fromDate(winDate);
                }

                console.log('Final win object to be saved:', win);
                batch.set(docRef, win);
                newWins.push({ id: docRef.id, ...win });
                importedCount++;
                
                // Log successful coach assignment
                if (coachId) {
                    console.log(`✅ Win "${win.win_title}" assigned to coach ID: ${coachId}`);
                } else {
                    console.log(`⚠️ Win "${win.win_title}" has no coach assignment`);
                }
            }

            await batch.commit();
            
            // Reload wins from database to ensure data consistency
            await this.loadWins();
            
            // Re-render the table
            this.renderWinsTable();
            
            // Close modal
            this.winsCsvImportModal.classList.remove('show');
            
            console.log('Wins imported successfully');
            let message = `${importedCount} win${importedCount === 1 ? '' : 's'} imported successfully`;
            if (skippedCount > 0) {
                message += `. ${skippedCount} win${skippedCount === 1 ? '' : 's'} skipped (missing title).`;
            }
            alert(message);
            
        } catch (error) {
            console.error('Error importing wins:', error);
            alert('Failed to import wins. Please try again.');
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
                    
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media URL</label>
                        <input type="url" id="editWinMediaUrl" value="${win.media_url || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="https://example.com/media">
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
                null,
            media_url: document.getElementById('editWinMediaUrl').value
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
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media Type</label>
                        <select id="newWinMediaType" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="">Select Type</option>
                            <option value="Video">Video</option>
                            <option value="Written">Written</option>
                            <option value="Interview">Interview</option>
                            <option value="Screenshot">Screenshot</option>
                            <option value="Image">Image</option>
                            <option value="Audio">Audio</option>
                            <option value="Document">Document</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Media URL</label>
                        <input type="url" id="newWinMediaUrl" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="https://example.com/media">
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
            media_url: document.getElementById('newWinMediaUrl').value,
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
            
            // Also update all data cells in the table
            const cells = document.querySelectorAll(`td.col-${column}`);
            cells.forEach(cell => {
                cell.style.display = checkbox.checked ? 'table-cell' : 'none';
            });
        });
        this.closeWinsColumnModal();
        // Re-render the table to ensure proper alignment
        this.renderWinsTable();
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

    toggleFilters() {
        if (this.currentSection === 'coaches') {
            const isVisible = this.coachesFilters.style.display !== 'none';
            this.coachesFilters.style.display = isVisible ? 'none' : 'block';
            this.toggleFiltersBtn.textContent = isVisible ? 'Filters' : 'Hide Filters';
        } else if (this.currentSection === 'media') {
            const isVisible = this.mediaFilters.style.display !== 'none';
            this.mediaFilters.style.display = isVisible ? 'none' : 'block';
            this.toggleFiltersBtn.textContent = isVisible ? 'Filters' : 'Hide Filters';
        }
    }

    applyCoachesFilters(data = this.coaches) {
        let filteredData = [...data];

        // Wins count filter
        const winsCountFilter = this.winsCountFilter.value;
        if (winsCountFilter) {
            filteredData = filteredData.filter(coach => {
                const coachWins = this.wins.filter(win => win.coach_id === coach.id);
                const winsCount = coachWins.length;
                
                switch (winsCountFilter) {
                    case '0': return winsCount === 0;
                    case '1': return winsCount === 1;
                    case '2-5': return winsCount >= 2 && winsCount <= 5;
                    case '6-10': return winsCount >= 6 && winsCount <= 10;
                    case '10+': return winsCount > 10;
                    default: return true;
                }
            });
        }

        // Join date filter
        const joinDateFilter = this.joinDateFilter.value;
        if (joinDateFilter) {
            const now = new Date();
            const filterDate = new Date();
            
            switch (joinDateFilter) {
                case 'last-week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'last-month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'last-3-months':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'last-year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filteredData = filteredData.filter(coach => {
                if (!coach.join_date) return false;
                const joinDate = coach.join_date.seconds ? new Date(coach.join_date.seconds * 1000) : new Date(coach.join_date);
                return joinDate >= filterDate;
            });
        }

        // Most recent win filter
        const recentWinFilter = this.recentWinFilter.value;
        if (recentWinFilter) {
            const now = new Date();
            const filterDate = new Date();
            
            switch (recentWinFilter) {
                case 'last-week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'last-month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'last-3-months':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'last-year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
                case 'no-wins':
                    return filteredData.filter(coach => {
                        const coachWins = this.wins.filter(win => win.coach_id === coach.id);
                        return coachWins.length === 0;
                    });
            }
            
            if (recentWinFilter !== 'no-wins') {
                filteredData = filteredData.filter(coach => {
                    const coachWins = this.wins.filter(win => win.coach_id === coach.id);
                    if (coachWins.length === 0) return false;
                    
                    const mostRecentWin = coachWins.reduce((latest, win) => {
                        const winTime = win.win_date?.seconds || 0;
                        const latestTime = latest.win_date?.seconds || 0;
                        return winTime > latestTime ? win : latest;
                    });
                    
                    const mostRecentDate = mostRecentWin.win_date?.seconds ? new Date(mostRecentWin.win_date.seconds * 1000) : new Date(mostRecentWin.win_date);
                    return mostRecentDate >= filterDate;
                });
            }
        }

        // Media type filter
        const mediaTypeFilter = this.coachMediaTypeFilter.value;
        if (mediaTypeFilter) {
            if (mediaTypeFilter === 'no-media') {
                filteredData = filteredData.filter(coach => {
                    const coachWins = this.wins.filter(win => win.coach_id === coach.id);
                    return coachWins.every(win => !win.media_url);
                });
            } else {
                filteredData = filteredData.filter(coach => {
                    const coachWins = this.wins.filter(win => win.coach_id === coach.id);
                    return coachWins.some(win => win.media_url);
                });
            }
        }

        return filteredData;
    }

    // Media methods
    async loadMedia() {
        try {
            console.log('Loading media...');
            const snapshot = await this.db.collection('media').get();
            this.media = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('Media loaded:', this.media.length);
        } catch (error) {
            console.error('Error loading media:', error);
            this.media = [];
        }
    }

    renderMediaTable() {
        console.log('Rendering media table, count:', this.media.length);
        
        if (this.media.length === 0) {
            this.mediaTableBody.innerHTML = '<tr><td colspan="4" class="loading">Loading media...</td></tr>';
            return;
        }

        let data = this.media;

        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(media => {
                const win = this.wins.find(w => w.id === media.win_id);
                const coach = win ? this.coaches.find(c => c.id === win.coach_id) : null;
                const winTitle = win ? win.win_title : '';
                const coachName = coach ? `${coach.first_name} ${coach.last_name}` : '';
                
                return media.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       media.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       media.content?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       winTitle?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       coachName?.toLowerCase().includes(this.searchTerm.toLowerCase());
            });
        }

        // Apply media filters
        data = this.applyMediaFilters(data);

        if (data.length === 0) {
            this.mediaTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No media found</td></tr>';
            return;
        }

        this.mediaTableBody.innerHTML = data.map(media => {
            const win = this.wins.find(w => w.id === media.win_id);
            const coachFromWin = win ? this.coaches.find(c => c.id === win.coach_id) : null;
            const coachFromMedia = media.coach_id ? this.coaches.find(c => c.id === media.coach_id) : null;
            
            // Prefer coach from media.coach_id, fallback to coach from win
            const coach = coachFromMedia || coachFromWin;
            const winTitle = win ? win.win_title : 'Unassigned';
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'No Coach';
            const isImage = media.type === 'Screenshot' || media.type === 'Image';
            const previewHtml = isImage && media.url ? 
                `<img src="${media.url}" alt="preview" class="media-preview-thumb" style="width:64px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;" />` : 
                '<div class="media-preview-thumb" style="display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:12px;width:64px;height:40px;background:#f3f4f6;border-radius:6px;border:1px solid #e5e7eb;">—</div>';
            
            return `
                <tr>
                    <td class="checkbox-col">
                        <input type="checkbox" class="row-checkbox" data-id="${media.id}">
                    </td>
                    <td class="col-preview">${previewHtml}</td>
                    <td class="col-title">
                        <span class="media-title-link" data-media-id="${media.id}" style="cursor: pointer; color: #1f2937; text-decoration: none; font-weight: 500;">
                            ${media.title || 'Untitled'}
                        </span>
                    </td>
                    <td class="col-coach">
                        <span style="color: #1f2937; font-weight: 500;">
                            ${coachName}
                        </span>
                    </td>
                    <td class="col-win">
                        <span class="win-link" data-win-id="${media.win_id || ''}" style="cursor: pointer; color: #1f2937; text-decoration: none;">
                            ${winTitle}
                        </span>
                    </td>
                    <td class="col-type">${media.type || 'Unknown'}</td>
                    <td class="col-platform" style="display: none;">${media.platform || 'Unknown'}</td>
                    <td class="col-duration" style="display: none;">${media.duration || '-'}</td>
                    <td class="col-created" style="display: none;">${this.formatDate(media.created_at)}</td>
                </tr>
            `;
        }).join('');

        // Add click handlers for win links
        this.mediaTableBody.querySelectorAll('.win-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const winId = link.getAttribute('data-win-id');
                const mediaId = link.closest('tr').querySelector('.row-checkbox').getAttribute('data-id');
                console.log('Win link clicked, winId:', winId, 'mediaId:', mediaId);
                
                if (winId && winId !== '') {
                    // If assigned to a win, show win detail
                    this.showWinDetail(winId);
                } else {
                    // If unassigned, show win selection modal
                    this.showWinSelectionModal(mediaId);
                }
            });
        });

        // Add click handlers for media title links
        this.mediaTableBody.querySelectorAll('.media-title-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const mediaId = link.getAttribute('data-media-id');
                console.log('Media title clicked, mediaId:', mediaId);
                this.showMediaDetail(mediaId);
            });
        });

        // Add event listeners to checkboxes for bulk actions
        setTimeout(() => {
            this.mediaTableBody.querySelectorAll('.row-checkbox').forEach(checkbox => {
                // Remove existing listeners to prevent duplicates
                checkbox.removeEventListener('change', this.updateBulkActionsBar);
                checkbox.addEventListener('change', (e) => {
                    console.log('Media checkbox changed:', e.target.checked, e.target.getAttribute('data-id'));
                    this.updateBulkActionsBar();
                });
            });
        }, 100);
    }

    applyMediaFilters(data = null) {
        if (data === null) {
            data = this.media;
        }

        // Type filter
        const typeFilter = this.mediaTypeFilter.value;
        if (typeFilter) {
            data = data.filter(media => media.type === typeFilter);
        }

        // Platform filter
        const platformFilter = this.mediaPlatformFilter.value;
        if (platformFilter) {
            data = data.filter(media => media.platform === platformFilter);
        }

        // Assignment filter
        const assignmentFilter = this.mediaAssignmentFilter.value;
        if (assignmentFilter === 'assigned') {
            data = data.filter(media => media.win_id);
        } else if (assignmentFilter === 'unassigned') {
            data = data.filter(media => !media.win_id);
        }

        return data;
    }

    showMediaColumnModal() {
        this.mediaColumnModal.classList.add('show');
    }

    applyMediaColumnChanges() {
        const checkboxes = this.mediaColumnModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const column = checkbox.getAttribute('data-column');
            const isChecked = checkbox.checked;
            
            // Update header visibility
            const header = document.querySelector(`th.col-${column}`);
            if (header) {
                header.style.display = isChecked ? '' : 'none';
            }
            
            // Update data cell visibility
            const cells = document.querySelectorAll(`td.col-${column}`);
            cells.forEach(cell => {
                cell.style.display = isChecked ? '' : 'none';
            });
        });
        
        this.mediaColumnModal.classList.remove('show');
        this.renderMediaTable();
    }

    addMedia() {
        // Populate win dropdown
        this.populateWinDropdown('newMediaWin');
        this.addMediaModal.classList.add('show');
    }

    bulkUpload() {
        // Populate win dropdown
        this.populateWinDropdown('bulkImageWin');
        this.bulkUploadModal.classList.add('show');
    }

    populateWinDropdown(selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Win (optional)</option>';
        
        this.wins.forEach(win => {
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
            const option = document.createElement('option');
            option.value = win.id;
            option.textContent = `${win.win_title} (${coachName})`;
            select.appendChild(option);
        });
    }

    async saveNewMediaItem() {
        const title = document.getElementById('newMediaTitle').value;
        const type = document.getElementById('newMediaType').value;
        const platform = document.getElementById('newMediaPlatform').value;
        const url = document.getElementById('newMediaUrl').value;
        const description = document.getElementById('newMediaDescription').value;
        const content = document.getElementById('newMediaContent').value;
        const winId = document.getElementById('newMediaWin').value;
        const fileInput = document.getElementById('newMediaFile');
        const file = fileInput.files[0];

        if (!title || !type) {
            alert('Please fill in required fields');
            return;
        }

        try {
            let result = null;
            
            // If we have a file, use enhanced upload with coach linking and OCR
            if (file) {
                const mediaData = {
                    type,
                    platform: platform || 'Firebase Storage',
                    url: url || '',
                    description: description || '',
                    win_id: winId || null
                };
                
                result = await this.processEnhancedMediaUpload(file, mediaData);
                
                // Show coach assignment suggestion if coach was found
                if (result.coach || result.extractedText) {
                    this.showCoachAssignmentSuggestion(result.mediaItem, result.coach, result.extractedText);
                }
            } else {
                // Regular media upload without file
                const mediaData = {
                    title,
                    type,
                    platform: platform || 'Database',
                    url: url || '',
                    description: description || '',
                    content: content || '',
                    win_id: winId || null,
                    created_at: new Date()
                };

                // If we have a URL that looks like a file, try to extract text
                if (url && (type === 'Screenshot' || type === 'Image')) {
                    try {
                        // Create a temporary image element to load the image for OCR
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        
                        img.onload = async () => {
                            try {
                                // Convert image to file-like object for OCR
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0);
                                
                                canvas.toBlob(async (blob) => {
                                    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                                    const extractedText = await this.extractTextFromImage(file);
                                    
                                    if (extractedText) {
                                        document.getElementById('newMediaContent').value = extractedText;
                                        console.log('Text extracted from URL image');
                                    }
                                }, 'image/jpeg');
                            } catch (error) {
                                console.log('Could not extract text from URL image:', error);
                            }
                        };
                        
                        img.src = url;
                    } catch (error) {
                        console.log('Could not process URL for OCR:', error);
                    }
                }

                await db.collection('media').add(mediaData);
            }
            
            // Reload media data
            await this.loadMedia();
            this.renderCurrentSection();
            
            // Close modal and reset form
            this.addMediaModal.classList.remove('show');
            document.getElementById('addMediaForm').reset();
            
            console.log('Media saved successfully');
        } catch (error) {
            console.error('Error saving media:', error);
            alert('Error saving media');
        }
    }

    async processBulkImageUpload() {
        const files = document.getElementById('bulkImageFiles').files;
        const type = document.getElementById('bulkImageType').value;
        const winId = document.getElementById('bulkImageWin').value;

        if (files.length === 0 || !type) {
            alert('Please select files and type');
            return;
        }

        // Check file sizes and warn about large files
        const largeFiles = Array.from(files).filter(file => file.size > 5 * 1024 * 1024); // 5MB
        if (largeFiles.length > 0) {
            const largeFileNames = largeFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`).join(', ');
            if (!confirm(`Large files detected: ${largeFileNames}\n\nLarge files may take longer to upload. Continue?`)) {
                return;
            }
        }

        // Show progress UI
        const progressDiv = document.getElementById('bulkUploadProgress');
        const statusSpan = document.getElementById('bulkUploadStatus');
        const countSpan = document.getElementById('bulkUploadCount');
        const progressBar = document.getElementById('bulkUploadProgressBar');
        const currentFileDiv = document.getElementById('bulkUploadCurrentFile');
        const uploadBtn = document.getElementById('processBulkUpload');

        progressDiv.style.display = 'block';
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        // Test Firebase Storage connection
        try {
            console.log('Testing Firebase Storage connection...');
            console.log('Storage object:', storage);
            console.log('Storage bucket:', storage.app.options.storageBucket);
            
            if (!storage) {
                throw new Error('Firebase Storage not initialized');
            }
            
            // Test with a tiny file to see if storage rules are blocking uploads
            console.log('Testing Firebase Storage with tiny test file...');
            const testBlob = new Blob(['test'], { type: 'text/plain' });
            const testRef = storage.ref().child('test/connection-test.txt');
            
            try {
                console.log('Attempting test upload...');
                const uploadTask = testRef.put(testBlob);
                
                // Add timeout to test upload
                const testUpload = await Promise.race([
                    uploadTask,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Test upload timeout after 10 seconds')), 10000))
                ]);
                
                console.log('Firebase Storage test upload successful');
                
                // Try to get download URL
                const downloadURL = await testUpload.ref.getDownloadURL();
                console.log('Test file download URL:', downloadURL);
                
                // Clean up test file
                await testRef.delete();
                console.log('Test file cleaned up');
                
            } catch (testError) {
                console.error('Firebase Storage test failed:', testError);
                console.error('Error code:', testError.code);
                console.error('Error message:', testError.message);
                
                // Provide specific guidance based on error
                let errorGuidance = '';
                if (testError.code === 'storage/unauthorized') {
                    errorGuidance = '\n\nSOLUTION: Your Firebase Storage rules are blocking uploads. Go to Firebase Console > Storage > Rules and set:\n\nrules_version = \'2\';\nservice firebase.storage {\n  match /b/{bucket}/o {\n    match /{allPaths=**} {\n      allow read, write: if true;\n    }\n  }\n}';
                } else if (testError.code === 'storage/network-request-failed') {
                    errorGuidance = '\n\nSOLUTION: Network issue. Check if your firewall or network is blocking Firebase Storage requests.';
                } else if (testError.message.includes('timeout')) {
                    errorGuidance = '\n\nSOLUTION: Network timeout. Check your internet connection and try again.';
                }
                
                throw new Error(`Firebase Storage test failed: ${testError.message}${errorGuidance}`);
            }
            
        } catch (storageError) {
            console.error('Firebase Storage error:', storageError);
            
            statusSpan.textContent = 'Firebase Storage error';
            statusSpan.style.color = '#ef4444';
            currentFileDiv.textContent = `Error: ${storageError.message}`;
            currentFileDiv.style.color = '#ef4444';
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Images';
            
            // Show detailed error in alert
            alert(`Firebase Storage Error:\n\n${storageError.message}\n\nPlease check the browser console for detailed instructions on how to fix this issue.`);
            return;
        }

        try {
            const uploadResults = [];
            const totalFiles = files.length;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const progress = ((i + 1) / totalFiles) * 100;
                
                // Update progress UI
                statusSpan.textContent = 'Processing...';
                countSpan.textContent = `${i + 1}/${totalFiles}`;
                progressBar.style.width = `${progress}%`;
                currentFileDiv.textContent = file.name;
                
                console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`);
                
                // Extract coach name and title from filename
                const coachName = this.extractCoachNameFromFilename(file.name);
                const title = this.extractTitleFromFilename(file.name);
                
                console.log('Processing file:', file.name);
                console.log('Extracted coach name:', coachName);
                console.log('Extracted title:', title);
                console.log('Available coaches:', this.coaches.map(c => `${c.first_name} ${c.last_name}`));
                
                // Find matching coach
                const coach = coachName ? this.findCoachByName(coachName) : null;
                
                // Extract text if it's an image
                statusSpan.textContent = 'Extracting text...';
                let extractedText = '';
                if (file.type.startsWith('image/') && (type === 'Screenshot' || type === 'Image')) {
                    try {
                        console.log('Starting OCR for file:', file.name);
                        extractedText = await Promise.race([
                            this.extractTextFromImage(file),
                            new Promise((_, reject) => setTimeout(() => reject(new Error('OCR timeout after 30 seconds')), 30000))
                        ]);
                        console.log('OCR completed for file:', file.name, 'Text length:', extractedText.length);
                    } catch (ocrError) {
                        console.error('OCR failed for file:', file.name, ocrError);
                        extractedText = ''; // Continue without OCR if it fails
                    }
                }
                
                // Compress image if it's large
                let fileToUpload = file;
                if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) { // 2MB
                    statusSpan.textContent = 'Compressing image...';
                    try {
                        fileToUpload = await this.compressImage(file);
                        console.log(`Compressed ${file.name}: ${(file.size/1024/1024).toFixed(1)}MB → ${(fileToUpload.size/1024/1024).toFixed(1)}MB`);
                    } catch (compressError) {
                        console.error('Compression failed, using original file:', compressError);
                        fileToUpload = file;
                    }
                }
                
                // Upload file to Firebase Storage
                statusSpan.textContent = 'Uploading file...';
                console.log('Starting file upload to Firebase Storage:', file.name);
                
                const storageRef = storage.ref();
                const fileRef = storageRef.child(`media/${Date.now()}_${file.name}`);
                
                let downloadURL = '';
                try {
                    // Start upload with progress tracking
                    const uploadTask = fileRef.put(fileToUpload);
                    
                    // Track upload progress
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload progress for ${file.name}: ${progress.toFixed(1)}%`);
                            statusSpan.textContent = `Uploading file... ${progress.toFixed(0)}%`;
                        },
                        (error) => {
                            console.error('Upload error:', error);
                        }
                    );
                    
                    // Wait for upload with longer timeout for large files
                    const timeoutDuration = file.size > 5 * 1024 * 1024 ? 120000 : 30000; // 2 minutes for large files, 30 seconds for small
                    const uploadSnapshot = await Promise.race([
                        uploadTask,
                        new Promise((_, reject) => setTimeout(() => reject(new Error(`Upload timeout after ${timeoutDuration/1000} seconds`)), timeoutDuration))
                    ]);
                    
                    console.log('File upload completed, getting download URL:', file.name);
                    downloadURL = await Promise.race([
                        uploadSnapshot.ref.getDownloadURL(),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Get URL timeout after 10 seconds')), 10000))
                    ]);
                    
                    console.log('File uploaded to Firebase Storage:', downloadURL);
                } catch (uploadError) {
                    console.error('Upload failed for file:', file.name, uploadError);
                    throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
                }
                
                // Save to database
                statusSpan.textContent = 'Saving to database...';
                console.log('Saving media data to Firestore:', file.name);
                
                const mediaData = {
                    title: title,
                    type,
                    platform: 'Firebase Storage',
                    url: downloadURL, // Use the uploaded file URL
                    description: `Bulk uploaded ${type.toLowerCase()}`,
                    content: extractedText, // OCR extracted text
                    coach_id: coach?.id || null,
                    win_id: winId || null,
                    file_name: file.name,
                    file_size: file.size,
                    created_at: new Date(),
                    status: 'pending_review'
                };

                try {
                    const docRef = await Promise.race([
                        db.collection('media').add(mediaData),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Database save timeout after 15 seconds')), 15000))
                    ]);
                    mediaData.id = docRef.id;
                    console.log('Media data saved to Firestore:', file.name);
                } catch (dbError) {
                    console.error('Database save failed for file:', file.name, dbError);
                    throw new Error(`Failed to save ${file.name} to database: ${dbError.message}`);
                }
                
                // Add to local array
                this.media.push(mediaData);
                
                uploadResults.push({
                    mediaItem: mediaData,
                    coach,
                    extractedText: extractedText.length > 0 ? extractedText : null
                });
            }
            
            // Update progress to completion
            statusSpan.textContent = 'Complete!';
            progressBar.style.width = '100%';
            countSpan.textContent = `${totalFiles}/${totalFiles}`;
            currentFileDiv.textContent = '';
            
            // Reload media data
            await this.loadMedia();
            this.renderCurrentSection();
            
            // Close modal and reset form
            this.bulkUploadModal.classList.remove('show');
            document.getElementById('bulkImageFiles').value = '';
            document.getElementById('bulkImageType').value = '';
            document.getElementById('bulkImageWin').value = '';
            
            // Show summary of upload results
            this.showBulkUploadSummary(uploadResults);
            
            console.log('Bulk upload completed:', uploadResults);
        } catch (error) {
            console.error('Error in bulk upload:', error);
            
            // Update UI to show error
            statusSpan.textContent = 'Error occurred';
            statusSpan.style.color = '#ef4444';
            currentFileDiv.textContent = `Error: ${error.message}`;
            currentFileDiv.style.color = '#ef4444';
            
            alert('Error uploading images: ' + error.message);
        } finally {
            // Reset button state
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Images';
            
            // Hide progress after a delay
            setTimeout(() => {
                progressDiv.style.display = 'none';
                statusSpan.style.color = '#374151';
                currentFileDiv.style.color = '#6b7280';
            }, 3000);
        }
    }

    addMediaToWin(winId) {
        // Populate win dropdown with the specific win pre-selected
        this.populateWinDropdown('newMediaWin');
        document.getElementById('newMediaWin').value = winId;
        this.addMediaModal.classList.add('show');
    }

    showWinSelectionModal(mediaId) {
        this.currentMediaId = mediaId;
        this.selectedWinId = null;
        this.winSearchInput.value = '';
        this.assignMediaToWin.disabled = true;
        this.populateWinsList();
        this.winSelectionModal.classList.add('show');
    }

    populateWinsList() {
        this.winsList.innerHTML = this.wins.map(win => {
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
            return `
                <div class="win-option" data-win-id="${win.id}" style="padding: 16px; border-bottom: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s; hover:background-color: #f3f4f6;">
                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px; font-size: 15px;">${win.win_title || 'Untitled Win'}</div>
                    <div style="font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 6px;">
                        <span style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;">👤</span>
                        ${coachName}
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers for win options
        this.winsList.querySelectorAll('.win-option').forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove previous selection
                this.winsList.querySelectorAll('.win-option').forEach(opt => {
                    opt.style.backgroundColor = '';
                    opt.style.borderLeft = '';
                });
                
                // Select this option
                option.style.backgroundColor = '#eff6ff';
                option.style.borderLeft = '4px solid #3b82f6';
                this.selectedWinId = option.getAttribute('data-win-id');
                this.assignMediaToWin.disabled = false;
            });
        });
    }

    filterWinsForSelection() {
        const searchTerm = this.winSearchInput.value.toLowerCase();
        const winOptions = this.winsList.querySelectorAll('.win-option');
        
        winOptions.forEach(option => {
            const winTitle = option.querySelector('div:first-child').textContent.toLowerCase();
            const coachName = option.querySelector('div:last-child').textContent.toLowerCase();
            const isVisible = winTitle.includes(searchTerm) || coachName.includes(searchTerm);
            option.style.display = isVisible ? 'block' : 'none';
        });
    }

    async assignSelectedWinToMedia() {
        if (!this.selectedWinId || !this.currentMediaId) return;

        try {
            await this.db.collection('media').doc(this.currentMediaId).update({
                win_id: this.selectedWinId
            });
            
            // Reload media data and refresh the table
            await this.loadMedia();
            this.renderCurrentSection();
            
            // Close modal
            this.winSelectionModal.classList.remove('show');
            
            console.log('Media assigned to win successfully');
        } catch (error) {
            console.error('Error assigning media to win:', error);
            alert('Error assigning media to win');
        }
    }

    async unassignMediaFromWinAction() {
        if (!this.currentMediaId) return;

        try {
            await this.db.collection('media').doc(this.currentMediaId).update({
                win_id: null
            });
            
            // Reload media data and refresh the table
            await this.loadMedia();
            this.renderCurrentSection();
            
            // Close modal
            this.winSelectionModal.classList.remove('show');
            
            console.log('Media unassigned from win successfully');
        } catch (error) {
            console.error('Error unassigning media from win:', error);
            alert('Error unassigning media from win');
        }
    }

    showEditMediaModal(mediaId) {
        this.currentEditMediaId = mediaId;
        const media = this.media.find(m => m.id === mediaId);
        if (!media) return;

        // Populate form fields
        document.getElementById('editMediaTitle').value = media.title || '';
        document.getElementById('editMediaType').value = media.type || '';
        document.getElementById('editMediaPlatform').value = media.platform || '';
        document.getElementById('editMediaUrl').value = media.url || '';
        document.getElementById('editMediaDescription').value = media.description || '';
        document.getElementById('editMediaContent').value = media.content || '';

        // Populate win dropdown
        this.populateWinDropdown('editMediaWin');
        document.getElementById('editMediaWin').value = media.win_id || '';

        this.editMediaModal.classList.add('show');
    }

    async saveEditMediaItem() {
        const title = document.getElementById('editMediaTitle').value;
        const type = document.getElementById('editMediaType').value;
        const platform = document.getElementById('editMediaPlatform').value;
        const url = document.getElementById('editMediaUrl').value;
        const description = document.getElementById('editMediaDescription').value;
        const content = document.getElementById('editMediaContent').value;
        const winId = document.getElementById('editMediaWin').value;

        if (!title || !type) {
            alert('Please fill in required fields');
            return;
        }

        try {
            const mediaData = {
                title,
                type,
                platform: platform || 'Database',
                url: url || '',
                description: description || '',
                content: content || '',
                win_id: winId || null,
                updated_at: new Date()
            };

            await this.db.collection('media').doc(this.currentEditMediaId).update(mediaData);
            
            // Reload media data
            await this.loadMedia();
            this.renderCurrentSection();
            
            // Close modal
            this.editMediaModal.classList.remove('show');
            
            console.log('Media updated successfully');
        } catch (error) {
            console.error('Error updating media:', error);
            alert('Error updating media');
        }
    }

    async deleteMediaItem() {
        if (!this.currentEditMediaId) return;

        if (!confirm('Are you sure you want to delete this media item? This action cannot be undone.')) {
            return;
        }

        try {
            await this.db.collection('media').doc(this.currentEditMediaId).delete();
            
            // Reload media data
            await this.loadMedia();
            this.renderCurrentSection();
            
            // Close modal
            this.editMediaModal.classList.remove('show');
            
            console.log('Media deleted successfully');
        } catch (error) {
            console.error('Error deleting media:', error);
            alert('Error deleting media');
        }
    }

    // ==================== NEW ENHANCED MEDIA UPLOAD FUNCTIONS ====================

    /**
     * Extract coach name from filename
     * Expected format: "Win Title - Coach Name.ext" or "Coach Name - Win Title.ext"
     */
    extractCoachNameFromFilename(filename) {
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, ""); // Remove extension
        
        // Try patterns: "Title - Coach Name" or "Coach Name - Title"
        const patterns = [
            /^(.+?)\s*-\s*(.+)$/,  // "Title - Coach Name"
            /^(.+?)\s*–\s*(.+)$/,  // "Title – Coach Name" (en dash)
            /^(.+?)\s*—\s*(.+)$/,  // "Title — Coach Name" (em dash)
        ];
        
        for (const pattern of patterns) {
            const match = nameWithoutExt.match(pattern);
            if (match) {
                // Check if the second part looks more like a coach name (has first/last name pattern)
                const secondPart = match[2].trim();
                const firstPart = match[1].trim();
                
                // If second part has typical name pattern (2+ words), it's likely the coach name
                if (secondPart.split(/\s+/).length >= 2) {
                    return secondPart;
                }
                // If first part has typical name pattern, it's likely the coach name
                else if (firstPart.split(/\s+/).length >= 2) {
                    return firstPart;
                }
            }
        }
        
        // If no pattern matches, return null (no coach name found)
        return null;
    }

    /**
     * Extract title from filename (removing coach name)
     */
    extractTitleFromFilename(filename) {
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        
        const patterns = [
            /^(.+?)\s*-\s*(.+)$/,  // "Title - Coach Name"
            /^(.+?)\s*–\s*(.+)$/,  // "Title – Coach Name"
            /^(.+?)\s*—\s*(.+)$/,  // "Title — Coach Name"
        ];
        
        for (const pattern of patterns) {
            const match = nameWithoutExt.match(pattern);
            if (match) {
                const firstPart = match[1].trim();
                const secondPart = match[2].trim();
                
                // If second part has typical name pattern (2+ words), it's likely the coach name
                // Return the first part as the title
                if (secondPart.split(/\s+/).length >= 2) {
                    return firstPart;
                }
                // If first part has typical name pattern, it's likely the coach name
                // Return the second part as the title
                else if (firstPart.split(/\s+/).length >= 2) {
                    return secondPart;
                }
            }
        }
        
        return nameWithoutExt.trim();
    }

    /**
     * Find coach by name (fuzzy matching)
     */
    findCoachByName(coachName) {
        if (!coachName || !this.coaches.length) {
            console.log('No coach name provided or no coaches loaded');
            return null;
        }
        
        const normalizedInput = coachName.toLowerCase().trim();
        console.log('Looking for coach:', normalizedInput);
        console.log('Available coaches:', this.coaches.map(c => `${c.first_name} ${c.last_name}`));
        
        // First try exact match
        let coach = this.coaches.find(c => {
            const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
            return fullName === normalizedInput;
        });
        
        if (coach) {
            console.log('Exact match found:', coach.first_name, coach.last_name);
            return coach;
        }
        
        // Try partial matches - split input into words
        const inputWords = normalizedInput.split(/\s+/);
        coach = this.coaches.find(c => {
            const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
            const firstName = c.first_name.toLowerCase();
            const lastName = c.last_name.toLowerCase();
            
            // Check if all input words are found in the coach's name
            const allWordsMatch = inputWords.every(word => 
                fullName.includes(word) || firstName.includes(word) || lastName.includes(word)
            );
            
            // Also check if any significant word matches
            const significantMatch = inputWords.some(word => 
                word.length > 2 && (fullName.includes(word) || firstName.includes(word) || lastName.includes(word))
            );
            
            return allWordsMatch || significantMatch;
        });
        
        if (coach) {
            console.log('Partial match found:', coach.first_name, coach.last_name);
        } else {
            console.log('No coach match found for:', normalizedInput);
        }
        
        return coach;
    }

    /**
     * Extract text from image using OCR
     */
    async extractTextFromImage(imageFile) {
        try {
            console.log('Starting OCR for:', imageFile.name);
            
            const { data: { text } } = await Tesseract.recognize(
                imageFile,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                        }
                    }
                }
            );
            
            let extractedText = text.trim();
            
            // Clean up the extracted text
            extractedText = this.cleanExtractedText(extractedText);
            
            console.log('OCR completed. Extracted text length:', extractedText.length);
            
            return extractedText;
        } catch (error) {
            console.error('OCR failed:', error);
            return '';
        }
    }

    /**
     * Clean up extracted text from OCR
     */
    cleanExtractedText(text) {
        if (!text) return '';
        
        // Fix common OCR mistakes that change "/" to ":"
        // This happens when OCR misinterprets forward slashes
        let cleanedText = text
            .replace(/(\d+):(\d+)/g, '$1/$2') // Fix time-like patterns that should be fractions
            .replace(/(\w+):(\w+)/g, '$1/$2') // Fix word:word patterns that should be word/word
            .replace(/(\w+):(\d+)/g, '$1/$2') // Fix word:number patterns
            .replace(/(\d+):(\w+)/g, '$1/$2'); // Fix number:word patterns
        
        // Remove emoji reactions at the end of text
        // Common emoji patterns: 👍, ❤️, 😂, 🔥, etc.
        cleanedText = cleanedText.replace(/[\s\n]*[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}][\s\n]*$/gu, '');
        
        // Remove trailing punctuation that might be OCR artifacts
        cleanedText = cleanedText.replace(/[^\w\s\n.!?]$/, '');
        
        // Clean up multiple spaces and line breaks
        cleanedText = cleanedText
            .replace(/\s+/g, ' ')
            .replace(/\n\s+/g, '\n')
            .replace(/\s+\n/g, '\n')
            .trim();
        
        return cleanedText;
    }

    /**
     * Compress image to reduce file size
     */
    async compressImage(file, maxWidth = 1920, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Compression failed'));
                    }
                }, 'image/jpeg', quality);
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Enhanced media upload with coach linking and OCR
     */
    async processEnhancedMediaUpload(file, mediaData) {
        try {
            // Extract coach name and title from filename
            const coachName = this.extractCoachNameFromFilename(file.name);
            const title = this.extractTitleFromFilename(file.name);
            
            console.log('Processing file:', file.name);
            console.log('Extracted coach name:', coachName);
            console.log('Extracted title:', title);
            
            // Find matching coach
            const coach = coachName ? this.findCoachByName(coachName) : null;
            
            // Extract text if it's an image
            let extractedText = '';
            if (file.type.startsWith('image/') && (mediaData.type === 'Screenshot' || mediaData.type === 'Image')) {
                extractedText = await this.extractTextFromImage(file);
            }
            
            // Upload file to Firebase Storage
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`media/${Date.now()}_${file.name}`);
            const uploadTask = await fileRef.put(file);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            
            console.log('File uploaded to Firebase Storage:', downloadURL);
            
            // Create media item
            const mediaItem = {
                title: title,
                type: mediaData.type,
                platform: mediaData.platform || 'Firebase Storage',
                url: downloadURL, // Use the uploaded file URL
                description: mediaData.description || '',
                content: extractedText, // OCR extracted text
                coach_id: coach?.id || null,
                win_id: mediaData.win_id || null,
                file_name: file.name,
                file_size: file.size,
                created_at: new Date(),
                status: 'pending_review'
            };
            
            // Save to Firebase
            const docRef = await db.collection('media').add(mediaItem);
            mediaItem.id = docRef.id;
            
            // Add to local array
            this.media.push(mediaItem);
            
            console.log('Enhanced media upload completed:', mediaItem);
            
            return {
                mediaItem,
                coach,
                extractedText: extractedText.length > 0 ? extractedText : null
            };
            
        } catch (error) {
            console.error('Enhanced media upload failed:', error);
            throw error;
        }
    }

    /**
     * Show coach assignment suggestion
     */
    showCoachAssignmentSuggestion(mediaItem, coach, extractedText) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Media Upload Complete</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #1f2937;">Media: ${mediaItem.title}</h4>
                        ${coach ? `
                            <p style="margin: 0; color: #10b981; font-weight: 600;">
                                ✅ Coach Found: ${coach.first_name} ${coach.last_name}
                            </p>
                        ` : `
                            <p style="margin: 0; color: #f59e0b; font-weight: 600;">
                                ⚠️ No matching coach found for: "${mediaItem.file_name}"
                            </p>
                        `}
                    </div>
                    
                    ${extractedText ? `
                        <div style="margin-bottom: 20px;">
                            <h4 style="margin: 0 0 10px 0; color: #1f2937;">Extracted Text:</h4>
                            <div style="background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; max-height: 200px; overflow-y: auto;">
                                <pre style="margin: 0; white-space: pre-wrap; font-family: inherit; font-size: 14px; color: #374151;">${extractedText}</pre>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        ${coach ? `
                            <button onclick="adminPanel.createWinFromMedia('${mediaItem.id}', '${coach.id}')" 
                                    style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                                Create Win for ${coach.first_name}
                            </button>
                        ` : ''}
                        <button onclick="this.closest('.modal').remove()" 
                                style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Create a win from media item
     */
    async createWinFromMedia(mediaId, coachId) {
        try {
            const media = this.media.find(m => m.id === mediaId);
            const coach = this.coaches.find(c => c.id === coachId);
            
            if (!media || !coach) {
                alert('Media or coach not found');
                return;
            }
            
            const winData = {
                win_title: media.title,
                win_description: media.description || media.content || '',
                coach_id: coachId,
                win_date: new Date(),
                win_category: 'Social Media Post',
                priority: 'medium',
                show_on_wall: true,
                verification_status: 'verified',
                media_type: media.type,
                media_url: media.url,
                media_title: media.title,
                media_description: media.description,
                created_at: new Date()
            };
            
            const docRef = await db.collection('wins').add(winData);
            winData.id = docRef.id;
            
            // Update media with win_id
            await db.collection('media').doc(mediaId).update({ win_id: winData.id });
            media.win_id = winData.id;
            
            // Add to local arrays
            this.wins.push(winData);
            
            // Close modal and refresh
            document.querySelector('.modal.show')?.remove();
            this.renderCurrentSection();
            
            console.log('Win created from media:', winData);
            alert(`Win created for ${coach.first_name} ${coach.last_name}`);
            
        } catch (error) {
            console.error('Error creating win from media:', error);
            alert('Error creating win from media');
        }
    }

    /**
     * Show bulk upload summary with coach assignments and OCR results
     */
    showBulkUploadSummary(uploadResults) {
        const totalFiles = uploadResults.length;
        const coachesFound = uploadResults.filter(r => r.coach).length;
        const textExtracted = uploadResults.filter(r => r.extractedText).length;
        
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>Bulk Upload Complete</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 15px 0; color: #1f2937;">Upload Summary</h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 600; color: #1f2937;">${totalFiles}</div>
                                <div style="font-size: 14px; color: #6b7280;">Files Uploaded</div>
                            </div>
                            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 600; color: #10b981;">${coachesFound}</div>
                                <div style="font-size: 14px; color: #6b7280;">Coaches Matched</div>
                            </div>
                            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 600; color: #3b82f6;">${textExtracted}</div>
                                <div style="font-size: 14px; color: #6b7280;">Text Extracted</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="max-height: 300px; overflow-y: auto;">
                        <h4 style="margin: 0 0 10px 0; color: #1f2937;">Upload Details</h4>
                        ${uploadResults.map(result => `
                            <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 8px; background: #f9fafb;">
                                <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${result.mediaItem.title}</div>
                                <div style="font-size: 14px; color: #6b7280;">
                                    ${result.coach ? 
                                        `<span style="color: #10b981;">✅ ${result.coach.first_name} ${result.coach.last_name}</span>` : 
                                        '<span style="color: #f59e0b;">⚠️ No coach match</span>'
                                    }
                                    ${result.extractedText ? 
                                        `<span style="margin-left: 10px; color: #3b82f6;">📝 Text extracted</span>` : 
                                        ''
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
                        <button onclick="this.closest('.modal').remove()" 
                                style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Test function for coach name extraction (can be called from browser console)
     */
    testCoachNameExtraction() {
        const testFiles = [
            "2 Days Consultancy + 2 Mentor Clients from Old Contacts - Jason Greaves.jpg",
            "2nd Client + 4 More discovery calls - Liam Humphreys.png",
            "£8,100:mo after signing 4th client - Ashley Chivers.jpg",
            "Harriet Molyneaux 1st two clients.jpg"
        ];

        console.log('Testing coach name extraction:');
        testFiles.forEach(filename => {
            const coachName = this.extractCoachNameFromFilename(filename);
            const title = this.extractTitleFromFilename(filename);
            const coach = coachName ? this.findCoachByName(coachName) : null;
            
            console.log(`File: ${filename}`);
            console.log(`  Coach Name: ${coachName}`);
            console.log(`  Title: ${title}`);
            console.log(`  Coach Found: ${coach ? `${coach.first_name} ${coach.last_name}` : 'No match'}`);
            console.log('---');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating AdminPanel...');
    window.adminPanel = new AdminPanel();
    console.log('AdminPanel created:', window.adminPanel);
});