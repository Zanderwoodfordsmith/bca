class AdminPanel {
    constructor() {
        console.log('AdminPanel constructor starting...');
        this.coaches = [];
        this.wins = [];
        this.assets = [];
        this.currentSection = 'coaches';
        this.selectedItems = new Set();
        this.visibleColumns = {
            coaches: ['name', 'wins_count'],
            wins: ['coach', 'title', 'category', 'date', 'show_wall'],
            assets: ['win', 'type', 'title', 'status', 'url']
        };
        this.sortBy = 'wins_count_desc';
        this.sortColumn = 'wins_count';
        this.sortDirection = 'desc';
        this.groupBy = '';
        this.searchTerm = '';
        
        // Initialize Firebase Auth
        // this.auth = firebase.auth();
        
        // Use the already initialized Firebase instance from firebase-config.js
        console.log('Setting up Firebase db...');
        console.log('window.db available:', !!window.db);
        console.log('firebase available:', !!firebase);
        this.db = window.db || firebase.firestore();
        console.log('Firebase db:', this.db);
        
        // Check authentication status
        // this.checkAuthStatus();
        
        console.log('Initializing elements...');
        this.initializeElements();
        console.log('Binding events...');
        this.bindEvents();
        console.log('Loading all data...');
        // Add a small delay to ensure Firebase is fully loaded
        setTimeout(() => {
            this.loadAllData();
        }, 100);
        console.log('Initializing column sorting...');
        this.initializeColumnSorting();
        console.log('AdminPanel constructor completed');
    }

    initializeElements() {
        // Tab buttons
        this.coachesTab = document.getElementById('coachesTab');
        this.winsTab = document.getElementById('winsTab');
        this.assetsTab = document.getElementById('assetsTab');
        
        // Section containers
        this.coachesSection = document.getElementById('coachesSection');
        this.winsSection = document.getElementById('winsSection');
        this.assetsSection = document.getElementById('assetsSection');
        
        // Add buttons
        this.addCoachBtn = document.getElementById('addCoachBtn');
        this.addWinBtn = document.getElementById('addWinBtn');
        this.addAssetBtn = document.getElementById('addAssetBtn');
        this.bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        
        // Toolbar elements
        this.searchInput = document.getElementById('searchInput');
        this.groupBySelect = document.getElementById('groupBySelect');
        this.columnToggleBtn = document.getElementById('columnToggleBtn');
        
        // Table bodies
        this.coachesTableBody = document.getElementById('coachesTableBody');
        this.winsTableBody = document.getElementById('winsTableBody');
        this.assetsTableBody = document.getElementById('assetsTableBody');
        
        // Checkbox elements
        this.selectAllCoaches = document.getElementById('selectAllCoaches');
        this.selectAllWins = document.getElementById('selectAllWins');
        this.selectAllAssets = document.getElementById('selectAllAssets');
        
        // Current section title
        this.currentSectionTitle = document.getElementById('currentSectionTitle');
        
        // Settings
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsDropdown = document.getElementById('settingsDropdown');
        this.importBtn = document.getElementById('importBtn');
        this.inviteUserBtn = document.getElementById('inviteUserBtn');
        this.embedBtn = document.getElementById('embedBtn');
        this.embedModal = document.getElementById('embedModal');
        this.embedCode = document.getElementById('embedCode');
        this.copyEmbedBtn = document.getElementById('copyEmbedBtn');
        
        // View proof wall button
        this.viewProofWall = document.getElementById('viewProofWall');
        
        // CSV file inputs (now in modal)
        this.coachCsvFile = document.getElementById('coachCsvFile');
        this.winCsvFile = document.getElementById('winCsvFile');
        this.assetCsvFile = document.getElementById('assetCsvFile');
        
        // Import modal buttons
        this.selectCoachFile = document.getElementById('selectCoachFile');
        this.selectWinFile = document.getElementById('selectWinFile');
        this.selectAssetFile = document.getElementById('selectAssetFile');
        this.downloadCoachTemplate = document.getElementById('downloadCoachTemplate');
        this.downloadWinTemplate = document.getElementById('downloadWinTemplate');
        this.downloadAssetTemplate = document.getElementById('downloadAssetTemplate');
    }

    bindEvents() {
        // Tab switching
        this.coachesTab.addEventListener('click', () => this.switchTab('coaches'));
        this.winsTab.addEventListener('click', () => this.switchTab('wins'));
        this.assetsTab.addEventListener('click', () => this.switchTab('assets'));
        
        // Add buttons
        this.addCoachBtn.addEventListener('click', () => this.showModal('coachModal'));
        this.addWinBtn.addEventListener('click', () => this.showModal('winModal'));
        this.addAssetBtn.addEventListener('click', () => this.showModal('assetModal'));
        this.bulkDeleteBtn.addEventListener('click', () => this.bulkDelete());
        
        // Toolbar events
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.groupBySelect.addEventListener('change', () => this.handleGroupBy());
        this.columnToggleBtn.addEventListener('click', () => this.showColumnModal());
        
        // Checkbox events
        this.selectAllCoaches.addEventListener('change', (e) => this.handleSelectAll('coaches', e.target.checked));
        this.selectAllWins.addEventListener('change', (e) => this.handleSelectAll('wins', e.target.checked));
        this.selectAllAssets.addEventListener('change', (e) => this.handleSelectAll('assets', e.target.checked));
        
        // Settings
        this.settingsBtn.addEventListener('click', () => this.toggleSettingsDropdown());
        this.importBtn.addEventListener('click', () => this.showImportModal());
        this.inviteUserBtn.addEventListener('click', () => this.showInviteUserModal());
        this.embedBtn.addEventListener('click', () => this.showEmbedModal());
        this.copyEmbedBtn.addEventListener('click', () => this.copyEmbedCode());
        
        // Import modal buttons
        this.selectCoachFile.addEventListener('click', () => this.coachCsvFile.click());
        this.selectWinFile.addEventListener('click', () => this.winCsvFile.click());
        this.selectAssetFile.addEventListener('click', () => this.assetCsvFile.click());
        this.downloadCoachTemplate.addEventListener('click', () => this.downloadTemplate('coaches'));
        this.downloadWinTemplate.addEventListener('click', () => this.downloadTemplate('wins'));
        this.downloadAssetTemplate.addEventListener('click', () => this.downloadTemplate('assets'));
        
        // CSV file inputs
        this.coachCsvFile.addEventListener('change', (e) => this.handleCsvImport(e, 'coaches'));
        this.winCsvFile.addEventListener('change', (e) => this.handleCsvImport(e, 'wins'));
        this.assetCsvFile.addEventListener('change', (e) => this.handleCsvImport(e, 'assets'));
        
        // View proof wall
        this.viewProofWall.addEventListener('click', () => window.open('index.html', '_blank'));
        
        // Form submissions
        document.getElementById('coachForm').addEventListener('submit', (e) => this.saveCoach(e));
        document.getElementById('winForm').addEventListener('submit', (e) => this.saveWin(e));
        document.getElementById('assetForm').addEventListener('submit', (e) => this.saveAsset(e));
        document.getElementById('inviteUserForm').addEventListener('submit', (e) => this.inviteUser(e));
        
        // Column modal
        document.getElementById('applyColumns').addEventListener('click', () => this.applyColumnSettings());
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.remove('show');
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('show');
            }
            if (!event.target.closest('.settings-menu')) {
                this.settingsDropdown.classList.remove('show');
            }
            // Close column modal when clicking outside
            if (event.target.id === 'columnModal') {
                this.closeColumnModal();
            }
        });
    }

    switchTab(section) {
        // Update tab buttons
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
        
        // Hide all add buttons
        this.addCoachBtn.style.display = 'none';
        this.addWinBtn.style.display = 'none';
        this.addAssetBtn.style.display = 'none';
        this.bulkDeleteBtn.style.display = 'none';
        
        // Clear selections
        this.selectedItems.clear();
        
        if (section === 'coaches') {
            this.coachesTab.classList.add('active');
            this.coachesSection.classList.add('active');
            this.addCoachBtn.style.display = 'inline-block';
            this.currentSectionTitle.textContent = 'Coaches';
        } else if (section === 'wins') {
            this.winsTab.classList.add('active');
            this.winsSection.classList.add('active');
            this.addWinBtn.style.display = 'inline-block';
            this.currentSectionTitle.textContent = 'Wins';
        } else if (section === 'assets') {
            this.assetsTab.classList.add('active');
            this.assetsSection.classList.add('active');
            this.addAssetBtn.style.display = 'inline-block';
            this.currentSectionTitle.textContent = 'Assets';
        }
        
        this.currentSection = section;
        this.renderCurrentSection();
    }

    async loadAllData() {
        try {
            console.log('Starting to load all data...');
            await Promise.all([
                this.loadCoaches(),
                this.loadWins(),
                this.loadAssets()
            ]);
            console.log('All data loaded, rendering current section...');
            this.renderCurrentSection();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please check your Firebase configuration.');
        }
    }

    async loadCoaches() {
        try {
            console.log('Loading coaches...');
            const snapshot = await this.db.collection('coaches').get();
            this.coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Coaches loaded:', this.coaches.length);
        } catch (error) {
            console.error('Error loading coaches:', error);
            // Add some sample data for testing
            this.coaches = [
                { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' }
            ];
            console.log('Using sample coaches:', this.coaches.length);
        }
    }

    async loadWins() {
        try {
            const snapshot = await this.db.collection('wins').orderBy('win_date', 'desc').get();
            this.wins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Loaded wins:', this.wins.length);
        } catch (error) {
            console.error('Error loading wins:', error);
            // Add some sample data for testing
            this.wins = [
                { id: '1', coach_id: '1', win_title: 'Sample Win 1', win_date: { seconds: Date.now() / 1000 } },
                { id: '2', coach_id: '2', win_title: 'Sample Win 2', win_date: { seconds: Date.now() / 1000 } }
            ];
            console.log('Using sample wins:', this.wins.length);
        }
    }

    async loadAssets() {
        try {
            const snapshot = await this.db.collection('proof_assets').get();
            this.assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Loaded assets:', this.assets.length);
        } catch (error) {
            console.error('Error loading assets:', error);
            // Add some sample data for testing
            this.assets = [
                { id: '1', win_id: '1', asset_title: 'Sample Asset 1' },
                { id: '2', win_id: '2', asset_title: 'Sample Asset 2' }
            ];
            console.log('Using sample assets:', this.assets.length);
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
            case 'assets':
                this.renderAssetsTable();
                break;
        }
    }

    renderCoachesTable() {
        console.log('Rendering coaches table, coaches count:', this.coaches.length);
        
        // If coaches haven't loaded yet, show loading message
        if (this.coaches.length === 0) {
            this.coachesTableBody.innerHTML = `<tr><td colspan="3" class="loading">Loading coaches...</td></tr>`;
            return;
        }
        
        let data = this.filterAndSortData(this.coaches, 'coaches');
        
        if (data.length === 0) {
            this.coachesTableBody.innerHTML = `<tr><td colspan="3" class="loading">No coaches found</td></tr>`;
            return;
        }

        console.log('Rendering', data.length, 'coaches');
        this.coachesTableBody.innerHTML = data.map(coach => {
            const linkedWins = this.wins.filter(win => win.coach_id === coach.id);
            
            return `
            <tr data-id="${coach.id}" onclick="adminPanel.showCoachDetailView('${coach.id}')">
                <td class="checkbox-col" onclick="event.stopPropagation()">
                    <input type="checkbox" class="row-checkbox" data-id="${coach.id}" onchange="adminPanel.handleRowSelect('${coach.id}', this.checked)">
                </td>
                <td class="col-name">${coach.first_name || ''} ${coach.last_name || ''}</td>
                <td class="col-wins-count">${linkedWins.length}</td>
            </tr>
            `;
        }).join('');
    }

    renderWinsTable() {
        let data = this.filterAndSortData(this.wins, 'wins');
        
        if (data.length === 0) {
            const visibleColumnCount = this.visibleColumns.wins.length + 1; // +1 for checkbox column
            this.winsTableBody.innerHTML = `<tr><td colspan="${visibleColumnCount}" class="loading">No wins found</td></tr>`;
            return;
        }

        this.winsTableBody.innerHTML = data.map(win => {
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
            const linkedAssets = this.assets.filter(asset => asset.win_id === win.id);
            
            return `
                <tr data-id="${win.id}" onclick="adminPanel.showWinDetailView('${win.id}')">
                    <td class="checkbox-col" onclick="event.stopPropagation()">
                        <input type="checkbox" class="row-checkbox" data-id="${win.id}" onchange="adminPanel.handleRowSelect('${win.id}', this.checked)">
                    </td>
                    <td class="col-coach">${coachName}</td>
                    <td class="col-title">${win.win_title}</td>
                    <td class="col-category">${win.win_category}</td>
                    <td class="col-date">${this.formatDate(win.win_date)}</td>
                    <td class="col-assets">${linkedAssets.length} assets</td>
                    <td class="col-show-wall">
                        <span class="${win.show_on_wall ? 'show-on-wall' : 'not-show-on-wall'}">
                            ${win.show_on_wall ? 'Yes' : 'No'}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
        
    }

    renderAssetsTable() {
        let data = this.filterAndSortData(this.assets, 'assets');
        
        if (data.length === 0) {
            const visibleColumnCount = this.visibleColumns.assets.length + 1; // +1 for checkbox column
            this.assetsTableBody.innerHTML = `<tr><td colspan="${visibleColumnCount}" class="loading">No assets found</td></tr>`;
            return;
        }

        this.assetsTableBody.innerHTML = data.map(asset => {
            const win = this.wins.find(w => w.id === asset.win_id);
            const winTitle = win ? win.win_title : 'Unknown Win';
            
            return `
                <tr data-id="${asset.id}" onclick="adminPanel.editAsset('${asset.id}')">
                    <td class="checkbox-col" onclick="event.stopPropagation()">
                        <input type="checkbox" class="row-checkbox" data-id="${asset.id}" onchange="adminPanel.handleRowSelect('${asset.id}', this.checked)">
                    </td>
                    <td class="col-win">${winTitle}</td>
                    <td class="col-type">${asset.asset_type}</td>
                    <td class="col-title">${asset.asset_title}</td>
                    <td class="col-status">
                        <span class="status-badge status-active">
                            Active
                        </span>
                    </td>
                    <td class="col-url">${asset.asset_url ? 'Yes' : 'No'}</td>
                </tr>
            `;
        }).join('');
        
    }

    filterAndSortData(data, type) {
        let filtered = [...data];
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(item => {
                const searchLower = this.searchTerm.toLowerCase();
                if (type === 'coaches') {
                    return (item.first_name + ' ' + item.last_name).toLowerCase().includes(searchLower) ||
                           (item.email || '').toLowerCase().includes(searchLower) ||
                           (item.bio || '').toLowerCase().includes(searchLower);
                } else if (type === 'wins') {
                    const coach = this.coaches.find(c => c.id === item.coach_id);
                    const coachName = coach ? `${coach.first_name} ${coach.last_name}` : '';
                    return item.win_title.toLowerCase().includes(searchLower) ||
                           item.win_description.toLowerCase().includes(searchLower) ||
                           item.win_category.toLowerCase().includes(searchLower) ||
                           coachName.toLowerCase().includes(searchLower);
                } else if (type === 'assets') {
                    const win = this.wins.find(w => w.id === item.win_id);
                    const winTitle = win ? win.win_title : '';
                    return item.asset_title.toLowerCase().includes(searchLower) ||
                           item.asset_description.toLowerCase().includes(searchLower) ||
                           item.asset_type.toLowerCase().includes(searchLower) ||
                           winTitle.toLowerCase().includes(searchLower);
                }
                return true;
            });
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            const direction = this.sortDirection === 'asc' ? 1 : -1;
            
            if (type === 'coaches') {
                switch (this.sortColumn) {
                    case 'name':
                        const nameA = `${a.first_name} ${a.last_name}`;
                        const nameB = `${b.first_name} ${b.last_name}`;
                        return nameA.localeCompare(nameB) * direction;
                    case 'email':
                        const emailA = a.email || '';
                        const emailB = b.email || '';
                        return emailA.localeCompare(emailB) * direction;
                    case 'join_date':
                        const joinDateA = new Date(a.join_date?.seconds * 1000 || 0);
                        const joinDateB = new Date(b.join_date?.seconds * 1000 || 0);
                        return (joinDateA - joinDateB) * direction;
                    case 'wins_count':
                        const winsCountA = this.wins.filter(win => win.coach_id === a.id).length;
                        const winsCountB = this.wins.filter(win => win.coach_id === b.id).length;
                        return (winsCountA - winsCountB) * direction;
                    case 'recent_win_date':
                        const recentWinA = this.getMostRecentWinDate(a.id);
                        const recentWinB = this.getMostRecentWinDate(b.id);
                        return (recentWinA - recentWinB) * direction;
                    case 'gender':
                        const genderA = a.gender || '';
                        const genderB = b.gender || '';
                        return genderA.localeCompare(genderB) * direction;
                    case 'bio':
                        const bioA = a.bio || '';
                        const bioB = b.bio || '';
                        return bioA.localeCompare(bioB) * direction;
                    case 'linkedin_url':
                        const linkedinA = a.linkedin_url || '';
                        const linkedinB = b.linkedin_url || '';
                        return linkedinA.localeCompare(linkedinB) * direction;
                    default:
                        return 0;
                }
            } else if (type === 'wins') {
                switch (this.sortColumn) {
                    case 'coach':
                        const coachA = this.coaches.find(c => c.id === a.coach_id);
                        const coachB = this.coaches.find(c => c.id === b.coach_id);
                        const coachNameA = coachA ? `${coachA.first_name} ${coachA.last_name}` : '';
                        const coachNameB = coachB ? `${coachB.first_name} ${coachB.last_name}` : '';
                        return coachNameA.localeCompare(coachNameB) * direction;
                    case 'title':
                        return a.win_title.localeCompare(b.win_title) * direction;
                    case 'category':
                        return a.win_category.localeCompare(b.win_category) * direction;
                    case 'date':
                        const dateA = new Date(a.win_date?.seconds * 1000 || 0);
                        const dateB = new Date(b.win_date?.seconds * 1000 || 0);
                        return (dateA - dateB) * direction;
                    case 'show_wall':
                        return (a.show_on_wall - b.show_on_wall) * direction;
                    default:
                        return 0;
                }
            } else if (type === 'assets') {
                switch (this.sortColumn) {
                    case 'win':
                        const winA = this.wins.find(w => w.id === a.win_id);
                        const winB = this.wins.find(w => w.id === b.win_id);
                        const winTitleA = winA ? winA.win_title : '';
                        const winTitleB = winB ? winB.win_title : '';
                        return winTitleA.localeCompare(winTitleB) * direction;
                    case 'type':
                        return (a.asset_type || '').localeCompare(b.asset_type || '') * direction;
                    case 'title':
                        return (a.asset_title || '').localeCompare(b.asset_title || '') * direction;
                    case 'status':
                        return (a.status || '').localeCompare(b.status || '') * direction;
                    case 'url':
                        return (a.asset_url || '').localeCompare(b.asset_url || '') * direction;
                    default:
                        return 0;
                }
            }
            return 0;
        });
        
        return filtered;
    }

    formatDate(timestamp) {
        if (!timestamp) return 'Date needed';
        const date = new Date(timestamp.seconds * 1000);
        const defaultDate = new Date('1999-01-01');
        
        if (date <= defaultDate) {
            return '<span class="date-needed">Date needed</span>';
        }
        
        // Format as d mmm YYYY (e.g., 20 Sep 2025)
        const day = date.getDate();
        const month = date.toLocaleDateString('en', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    cleanLinkedInUrl(url) {
        if (!url) return '';
        // Remove everything after and including the ?
        return url.split('?')[0];
    }

    getMostRecentWinDate(coachId) {
        const linkedWins = this.wins.filter(win => win.coach_id === coachId);
        if (linkedWins.length === 0) return new Date(0);
        
        const mostRecentWin = linkedWins.reduce((latest, current) => {
            const latestDate = new Date(latest.win_date.seconds * 1000);
            const currentDate = new Date(current.win_date.seconds * 1000);
            return currentDate > latestDate ? current : latest;
        });
        
        return new Date(mostRecentWin.win_date.seconds * 1000);
    }

    handleSearch() {
        this.searchTerm = this.searchInput.value;
        this.renderCurrentSection();
    }


    handleGroupBy() {
        this.groupBy = this.groupBySelect.value;
        // Grouping logic would go here
        this.renderCurrentSection();
    }

    handleRowSelect(id, checked) {
        if (checked) {
            this.selectedItems.add(id);
        } else {
            this.selectedItems.delete(id);
        }
        
        this.updateBulkActions();
        this.updateSelectAllState();
    }

    handleSelectAll(type, checked) {
        const tableBody = document.getElementById(`${type}TableBody`);
        const checkboxes = tableBody.querySelectorAll('.row-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const id = checkbox.dataset.id;
            if (checked) {
                this.selectedItems.add(id);
            } else {
                this.selectedItems.delete(id);
            }
        });
        
        this.updateBulkActions();
    }

    updateSelectAllState() {
        const tableBody = document.getElementById(`${this.currentSection}TableBody`);
        const checkboxes = tableBody.querySelectorAll('.row-checkbox');
        const checkedBoxes = tableBody.querySelectorAll('.row-checkbox:checked');
        
        const selectAllCheckbox = document.getElementById(`selectAll${this.currentSection.charAt(0).toUpperCase() + this.currentSection.slice(1)}`);
        
        if (checkedBoxes.length === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedBoxes.length === checkboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
    }

    updateBulkActions() {
        if (this.selectedItems.size > 0) {
            this.bulkDeleteBtn.style.display = 'inline-block';
        } else {
            this.bulkDeleteBtn.style.display = 'none';
        }
    }

    async bulkDelete() {
        if (this.selectedItems.size === 0) return;
        
        if (!confirm(`Are you sure you want to delete ${this.selectedItems.size} item(s)?`)) {
            return;
        }

        try {
            const promises = Array.from(this.selectedItems).map(id => {
                return this.db.collection(this.currentSection === 'coaches' ? 'coaches' : 
                                   this.currentSection === 'wins' ? 'wins' : 'proof_assets').doc(id).delete();
            });
            
            await Promise.all(promises);
            
            this.selectedItems.clear();
            this.loadAllData();
            this.showSuccess(`${this.selectedItems.size} item(s) deleted successfully!`);
        } catch (error) {
            console.error('Error deleting items:', error);
            this.showError('Failed to delete items.');
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
        
        // Populate dropdowns if needed
        if (modalId === 'winModal') {
            this.populateCoachDropdown();
        } else if (modalId === 'assetModal') {
            this.populateWinDropdown();
        }
    }

    populateCoachDropdown() {
        const select = document.getElementById('winCoachId');
        select.innerHTML = '<option value="">Select Coach</option>';
        
        console.log('Populating coach dropdown with coaches:', this.coaches);
        
        this.coaches.forEach(coach => {
            select.innerHTML += `<option value="${coach.id}">${coach.first_name} ${coach.last_name}</option>`;
        });
        
        console.log('Coach dropdown populated with', this.coaches.length, 'coaches');
        console.log('Dropdown options after population:', select.innerHTML);
    }

    populateWinDropdown() {
        const select = document.getElementById('assetWinId');
        select.innerHTML = '<option value="">Select Win</option>';
        this.wins.forEach(win => {
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown';
            select.innerHTML += `<option value="${win.id}">${coachName} - ${win.win_title}</option>`;
        });
    }


    initializeColumnSorting() {
        // Add click listeners to all sortable columns
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const sortField = header.dataset.sort;
                this.handleColumnSort(sortField);
            });
        });
        
        // Set initial sort state
        this.updateSortIndicators();
    }

    handleColumnSort(field) {
        // If clicking the same column, toggle direction
        if (this.sortColumn === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            this.sortColumn = field;
            this.sortDirection = 'asc';
        }
        
        this.sortBy = `${field}_${this.sortDirection}`;
        this.updateSortIndicators();
        this.renderCurrentSection();
    }

    updateSortIndicators() {
        // Remove all sort classes
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });
        
        // Add sort class to current column
        const currentHeader = document.querySelector(`[data-sort="${this.sortColumn}"]`);
        if (currentHeader) {
            currentHeader.classList.add(`sort-${this.sortDirection}`);
        }
    }


    showColumnModal() {
        document.getElementById('columnModal').classList.add('show');
    }

    closeColumnModal() {
        console.log('Closing column modal...');
        document.getElementById('columnModal').classList.remove('show');
    }



    toggleSettingsDropdown() {
        this.settingsDropdown.classList.toggle('show');
    }

    showImportModal() {
        document.getElementById('importModal').classList.add('show');
        this.settingsDropdown.style.display = 'none';
    }

    async saveCoach(e) {
        e.preventDefault();
        
        const coachData = {
            first_name: document.getElementById('coachFirstName').value,
            last_name: document.getElementById('coachLastName').value,
            email: document.getElementById('coachEmail').value,
            bio: document.getElementById('coachBio').value,
            profile_image: document.getElementById('coachProfileImage').value,
            phone: document.getElementById('coachPhone').value,
            website: document.getElementById('coachWebsite').value,
            linkedin_url: document.getElementById('coachLinkedIn').value,
            book_call_url: document.getElementById('coachBookCall').value,
            gender: document.getElementById('coachGender').value || '',
            join_date: new Date(document.getElementById('coachJoinDate').value)
        };

        const coachId = document.getElementById('coachId').value;
        
        try {
            if (coachId) {
                await this.db.collection('coaches').doc(coachId).update(coachData);
            } else {
                await this.db.collection('coaches').add(coachData);
            }
            
            this.closeModal('coachModal');
            this.loadCoaches();
            this.renderCurrentSection();
            this.showSuccess('Coach saved successfully!');
        } catch (error) {
            console.error('Error saving coach:', error);
            this.showError('Failed to save coach.');
        }
    }

    async saveWin(e) {
        e.preventDefault();
        
        const winData = {
            coach_id: document.getElementById('winCoachId').value,
            win_title: document.getElementById('winTitle').value,
            win_description: document.getElementById('winDescription').value,
            win_category: document.getElementById('winCategory').value,
            win_date: new Date(document.getElementById('winDate').value),
            show_on_wall: document.getElementById('winShowOnWall').checked
        };

        const winId = document.getElementById('winId').value;
        
        // Debug logging
        console.log('Saving win:', { winId, winData });
        
        try {
            if (winId) {
                await this.db.collection('wins').doc(winId).update(winData);
                console.log('Win updated successfully');
            } else {
                const docRef = await this.db.collection('wins').add(winData);
                console.log('Win created successfully with ID:', docRef.id);
            }
            
            this.closeModal('winModal');
            await this.loadWins(); // Wait for data to reload
            this.renderCurrentSection();
            this.showSuccess('Win saved successfully!');
        } catch (error) {
            console.error('Error saving win:', error);
            this.showError('Failed to save win: ' + error.message);
        }
    }

    async saveAsset(e) {
        e.preventDefault();
        
        const assetData = {
            win_id: document.getElementById('assetWinId').value,
            asset_type: document.getElementById('assetType').value,
            asset_format: document.getElementById('assetFormat').value,
            asset_title: document.getElementById('assetTitle').value,
            asset_description: document.getElementById('assetDescription').value,
            asset_url: document.getElementById('assetUrl').value || '', // Make URL optional
            created_date: new Date()
        };

        const assetId = document.getElementById('assetId').value;
        
        try {
            if (assetId) {
                await this.db.collection('proof_assets').doc(assetId).update(assetData);
            } else {
                await this.db.collection('proof_assets').add(assetData);
            }
            
            this.closeModal('assetModal');
            this.loadAssets();
            this.renderCurrentSection();
            this.showSuccess('Asset saved successfully!');
        } catch (error) {
            console.error('Error saving asset:', error);
            this.showError('Failed to save asset.');
        }
    }

    editCoach(coachId) {
        const coach = this.coaches.find(c => c.id === coachId);
        if (!coach) return;

        document.getElementById('coachId').value = coach.id;
        document.getElementById('coachFirstName').value = coach.first_name || '';
        document.getElementById('coachLastName').value = coach.last_name || '';
        document.getElementById('coachEmail').value = coach.email || '';
        document.getElementById('coachBio').value = coach.bio || '';
        document.getElementById('coachProfileImage').value = coach.profile_image || '';
        document.getElementById('coachPhone').value = coach.phone || '';
        document.getElementById('coachWebsite').value = coach.website || '';
        document.getElementById('coachLinkedIn').value = coach.linkedin_url || '';
        document.getElementById('coachBookCall').value = coach.book_call_url || '';
        document.getElementById('coachGender').value = coach.gender || '';
        document.getElementById('coachJoinDate').value = coach.join_date ? 
            new Date(coach.join_date.seconds * 1000).toISOString().split('T')[0] : '1999-01-01';

        this.showModal('coachModal');
    }

    editWin(winId) {
        const win = this.wins.find(w => w.id === winId);
        if (!win) {
            console.error('Win not found with ID:', winId);
            return;
        }

        console.log('Editing win:', win);
        console.log('Available coaches:', this.coaches);

        // Populate coach dropdown first
        this.populateCoachDropdown();
        
        // Set form values after dropdown is populated
        document.getElementById('winId').value = win.id;
        document.getElementById('winTitle').value = win.win_title || '';
        document.getElementById('winDescription').value = win.win_description || '';
        document.getElementById('winCategory').value = win.win_category || '';
        document.getElementById('winDate').value = win.win_date ? 
            new Date(win.win_date.seconds * 1000).toISOString().split('T')[0] : '';
        document.getElementById('winShowOnWall').checked = win.show_on_wall || false;

        // Set coach_id after a small delay to ensure dropdown is populated
        setTimeout(() => {
            document.getElementById('winCoachId').value = win.coach_id || '';
            console.log('Setting coach_id to:', win.coach_id);
            console.log('Coach dropdown value after setting:', document.getElementById('winCoachId').value);
        }, 10);

        this.showModal('winModal');
    }

    editAsset(assetId) {
        const asset = this.assets.find(a => a.id === assetId);
        if (!asset) return;

        // Populate win dropdown first
        this.populateWinDropdown();
        
        // Set form values after dropdown is populated
        document.getElementById('assetId').value = asset.id;
        document.getElementById('assetType').value = asset.asset_type || '';
        document.getElementById('assetFormat').value = asset.asset_format || '';
        document.getElementById('assetTitle').value = asset.asset_title || '';
        document.getElementById('assetDescription').value = asset.asset_description || '';
        document.getElementById('assetUrl').value = asset.asset_url || '';

        // Set win_id after a small delay to ensure dropdown is populated
        setTimeout(() => {
            document.getElementById('assetWinId').value = asset.win_id || '';
            console.log('Setting asset win_id to:', asset.win_id);
        }, 10);

        this.showModal('assetModal');
    }

    handleCsvImport(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',');
            
            let imported = 0;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const values = lines[i].split(',');
                    const data = {};
                    
                    headers.forEach((header, index) => {
                        data[header.trim()] = values[index] ? values[index].trim() : '';
                    });
                    
                    this.importData(data, type);
                    imported++;
                }
            }
            
            this.showSuccess(`CSV imported successfully! ${imported} records imported.`);
            this.loadAllData();
        };
        
        reader.readAsText(file);
    }

    async importData(data, type) {
        try {
            if (type === 'coaches') {
                data.join_date = new Date(data.join_date || '1999-01-01');
                await this.db.collection('coaches').add(data);
            } else if (type === 'wins') {
                data.win_date = new Date(data.win_date);
                data.show_on_wall = data.show_on_wall === 'true';
                await this.db.collection('wins').add(data);
            } else if (type === 'assets') {
                data.created_date = new Date();
                await this.db.collection('proof_assets').add(data);
            }
        } catch (error) {
            console.error('Error importing data:', error);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            console.log('Closed modal:', modalId);
        }
        
        // Reset form if it exists
        const formId = modalId.replace('Modal', 'Form');
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    showSuccess(message) {
        alert('✅ ' + message);
    }

    showError(message) {
        alert('❌ ' + message);
    }

    // ClickUp-style Detail Views
    showMainView() {
        document.getElementById('mainView').style.display = 'block';
        document.getElementById('coachDetailView').style.display = 'none';
        document.getElementById('winDetailView').style.display = 'none';
        document.getElementById('breadcrumb').style.display = 'none';
    }

    showCoachDetailView(coachId) {
        const coach = this.coaches.find(c => c.id === coachId);
        if (!coach) return;

        const linkedWins = this.wins.filter(win => win.coach_id === coachId);
        
        // Hide main view and show detail view
        document.getElementById('mainView').style.display = 'none';
        document.getElementById('coachDetailView').style.display = 'block';
        document.getElementById('winDetailView').style.display = 'none';
        document.getElementById('breadcrumb').style.display = 'block';
        
        // Update breadcrumb
        document.getElementById('breadcrumbCurrent').textContent = `${coach.first_name} ${coach.last_name}`;
        
        // Populate coach details
        document.getElementById('coachDetailName').textContent = `${coach.first_name} ${coach.last_name}`;
        document.getElementById('coachDetailEmail').textContent = coach.email || 'No email';
        document.getElementById('coachDetailJoinDate').textContent = this.formatDate(coach.join_date);
        document.getElementById('coachDetailWins').textContent = `${linkedWins.length} wins`;
        document.getElementById('coachDetailGender').textContent = coach.gender || 'Not specified';
        document.getElementById('coachDetailBio').textContent = coach.bio || 'No bio available';
        
        // Populate new fields
        document.getElementById('coachDetailPhone').textContent = coach.phone || 'Not provided';
        
        if (coach.website) {
            document.getElementById('coachDetailWebsite').innerHTML = `<a href="${coach.website}" target="_blank">Visit Website</a>`;
        } else {
            document.getElementById('coachDetailWebsite').textContent = 'Not provided';
        }
        
        if (coach.linkedin_url) {
            document.getElementById('coachDetailLinkedIn').innerHTML = `<a href="${coach.linkedin_url}" target="_blank">View Profile</a>`;
        } else {
            document.getElementById('coachDetailLinkedIn').textContent = 'Not provided';
        }
        
        if (coach.book_call_url) {
            document.getElementById('coachDetailBookCall').innerHTML = `<a href="${coach.book_call_url}" target="_blank">Book a Call</a>`;
        } else {
            document.getElementById('coachDetailBookCall').textContent = 'Not provided';
        }
        
        // Update wins tab count
        document.getElementById('winsTabCount').textContent = `(${linkedWins.length})`;
        
        // Populate wins list
        this.populateCoachWinsList(linkedWins);
        
        // Store current coach ID for reference
        this.currentCoachId = coachId;
    }

    showWinDetailView(winId) {
        const win = this.wins.find(w => w.id === winId);
        if (!win) return;

        const coach = this.coaches.find(c => c.id === win.coach_id);
        const linkedAssets = this.assets.filter(asset => asset.win_id === winId);
        
        // Hide main view and show detail view
        document.getElementById('mainView').style.display = 'none';
        document.getElementById('coachDetailView').style.display = 'none';
        document.getElementById('winDetailView').style.display = 'block';
        document.getElementById('breadcrumb').style.display = 'block';
        
        // Update breadcrumb
        const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
        document.getElementById('breadcrumbCurrent').textContent = `${coachName} > ${win.win_title}`;
        
        // Populate win details
        document.getElementById('winDetailTitle').textContent = win.win_title;
        document.getElementById('winDetailCoach').textContent = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
        document.getElementById('winDetailCategory').textContent = win.win_category;
        document.getElementById('winDetailDate').textContent = this.formatDate(win.win_date);
        document.getElementById('winDetailAssets').textContent = `${linkedAssets.length} assets`;
        document.getElementById('winDetailDescription').textContent = win.win_description || 'No description';
        document.getElementById('winDetailShowOnWall').textContent = win.show_on_wall ? 'Yes' : 'No';
        
        // Update assets tab count
        document.getElementById('assetsTabCount').textContent = `(${linkedAssets.length})`;
        
        // Populate assets list
        this.populateWinAssetsList(linkedAssets);
        
        // Store current win ID for reference
        this.currentWinId = winId;
    }

    populateCoachWinsList(wins) {
        const winsContainer = document.getElementById('coachWinsList');
        
        if (wins.length === 0) {
            winsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No wins associated with this coach.</p>';
            return;
        }
        
        winsContainer.innerHTML = `
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Win Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${wins.map(win => `
                            <tr onclick="adminPanel.showWinDetailView('${win.id}')" style="cursor: pointer;">
                                <td>
                                    <div class="win-title">${win.win_title}</div>
                                    ${win.win_description ? `<div class="win-description">${win.win_description.substring(0, 100)}${win.win_description.length > 100 ? '...' : ''}</div>` : ''}
                                </td>
                                <td>
                                    <span class="win-category">${win.win_category}</span>
                                </td>
                                <td>${this.formatDate(win.win_date)}</td>
                                <td>
                                    ${win.show_on_wall ? '<span class="status-badge approved">On Wall</span>' : '<span class="status-badge pending">Hidden</span>'}
                                </td>
                                <td>
                                    <button onclick="event.stopPropagation(); adminPanel.editWin('${win.id}')" class="btn btn-sm btn-outline">Edit</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    populateWinAssetsList(assets) {
        const assetsList = document.getElementById('winAssetsList');
        
        if (assets.length === 0) {
            assetsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No assets associated with this win.</p>';
            return;
        }
        
        assetsList.innerHTML = assets.map(asset => `
            <div class="asset-item" onclick="adminPanel.editAsset('${asset.id}')">
                <h4>${asset.asset_title || 'Untitled Asset'}</h4>
                <div class="asset-meta">
                    <span>${asset.asset_type || 'No type'}</span>
                    <span>${asset.asset_format || 'No format'}</span>
                </div>
                <p>${asset.asset_description || 'No description available'}</p>
                ${asset.asset_url ? `<a href="${asset.asset_url}" target="_blank" style="color: var(--primary);">View Asset</a>` : ''}
            </div>
        `).join('');
    }

    switchDetailTab(tabName) {
        // Remove active class from all tabs in the current detail view
        const currentView = document.getElementById('coachDetailView').style.display !== 'none' ? 'coach' : 'win';
        
        if (currentView === 'coach') {
            // Coach detail view - only has wins tab
            document.querySelectorAll('#coachDetailView .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#coachDetailView .tab-content').forEach(content => content.classList.remove('active'));
            
            if (tabName === 'wins') {
                document.querySelector('#coachDetailView .tab-btn[onclick*="wins"]').classList.add('active');
                document.getElementById('winsTab').classList.add('active');
            }
        } else {
            // Win detail view - only has assets tab
            document.querySelectorAll('#winDetailView .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#winDetailView .tab-content').forEach(content => content.classList.remove('active'));
            
            if (tabName === 'assets') {
                document.querySelector('#winDetailView .tab-btn[onclick*="assets"]').classList.add('active');
                document.getElementById('assetsTab').classList.add('active');
            }
        }
    }

    editCoachFromDetail() {
        if (this.currentCoachId) {
            this.editCoach(this.currentCoachId);
            this.showMainView();
        }
    }

    editWinFromDetail() {
        if (this.currentWinId) {
            this.editWin(this.currentWinId);
            this.showMainView();
        }
    }

    addWinForCoach() {
        if (this.currentCoachId) {
            this.showModal('winModal');
            // Pre-populate the coach field
            document.getElementById('winCoachId').value = this.currentCoachId;
        }
    }

    addAssetForWin() {
        if (this.currentWinId) {
            this.showModal('assetModal');
            // Pre-populate the win field
            document.getElementById('assetWinId').value = this.currentWinId;
        }
    }

    showCoachDetails(coachId) {
        const coach = this.coaches.find(c => c.id === coachId);
        if (!coach) return;

        const linkedWins = this.wins.filter(win => win.coach_id === coachId);
        
        const modalContent = document.querySelector('#coachModal .modal-content');
        modalContent.innerHTML = `
            <span class="close" onclick="closeModal('coachModal')">&times;</span>
            <h2>Coach Details: ${coach.first_name} ${coach.last_name}</h2>
            
            <div class="coach-details">
                <div class="detail-section">
                    <h3>Coach Information</h3>
                    <p><strong>Name:</strong> ${coach.first_name} ${coach.last_name}</p>
                    <p><strong>Email:</strong> ${coach.email || 'N/A'}</p>
                    <p><strong>Gender:</strong> ${coach.gender || 'Not specified'}</p>
                    <p><strong>Join Date:</strong> ${this.formatDate(coach.join_date)}</p>
                    <p><strong>Bio:</strong> ${coach.bio || 'No bio available'}</p>
                    <p><strong>LinkedIn:</strong> ${coach.linkedin_url ? `<a href="${coach.linkedin_url}" target="_blank">View Profile</a>` : 'Not provided'}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Linked Wins (${linkedWins.length})</h3>
                    ${linkedWins.length === 0 ? 
                        '<p>No wins associated with this coach.</p>' :
                        linkedWins.map(win => `
                            <div class="linked-item" onclick="adminPanel.showWinDetails('${win.id}'); closeModal('coachModal');">
                                <strong>${win.win_title}</strong>
                                <span class="win-category">${win.win_category}</span>
                                <span class="win-date">${this.formatDate(win.win_date)}</span>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div class="form-actions">
                <button onclick="adminPanel.editCoach('${coachId}'); closeModal('coachModal');" class="btn btn-primary">Edit Coach</button>
                <button onclick="closeModal('coachModal')" class="btn btn-secondary">Close</button>
            </div>
        `;
        
        this.showModal('coachModal');
    }

    showWinDetails(winId) {
        const win = this.wins.find(w => w.id === winId);
        if (!win) return;

        const coach = this.coaches.find(c => c.id === win.coach_id);
        const linkedAssets = this.assets.filter(asset => asset.win_id === winId);
        
        const modalContent = document.querySelector('#winModal .modal-content');
        modalContent.innerHTML = `
            <span class="close" onclick="closeModal('winModal')">&times;</span>
            <h2>Win Details: ${win.win_title}</h2>
            
            <div class="win-details">
                <div class="detail-section">
                    <h3>Win Information</h3>
                    <p><strong>Title:</strong> ${win.win_title}</p>
                    <p><strong>Description:</strong> ${win.win_description || 'No description'}</p>
                    <p><strong>Category:</strong> ${win.win_category}</p>
                    <p><strong>Date:</strong> ${this.formatDate(win.win_date)}</p>
                    <p><strong>Show on Wall:</strong> ${win.show_on_wall ? 'Yes' : 'No'}</p>
                    <p><strong>Coach:</strong> ${coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach'}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Linked Assets (${linkedAssets.length})</h3>
                    ${linkedAssets.length === 0 ? 
                        '<p>No assets associated with this win.</p>' :
                        linkedAssets.map(asset => `
                            <div class="linked-item" onclick="adminPanel.editAsset('${asset.id}'); closeModal('winModal');">
                                <strong>${asset.asset_title || 'Untitled Asset'}</strong>
                                <span class="asset-type">${asset.asset_type || 'No type'}</span>
                                <span class="asset-format">${asset.asset_format || 'No format'}</span>
                                ${asset.asset_url ? `<a href="${asset.asset_url}" target="_blank">View Asset</a>` : ''}
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div class="form-actions">
                <button onclick="adminPanel.editWin('${winId}'); closeModal('winModal');" class="btn btn-primary">Edit Win</button>
                <button onclick="closeModal('winModal')" class="btn btn-secondary">Close</button>
            </div>
        `;
        
        this.showModal('winModal');
    }

    showEmbedModal() {
        const currentURL = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
        const embedCode = `<iframe src="${currentURL}" width="100%" height="600" frameborder="0" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"></iframe>`;
        
        this.embedCode.value = embedCode;
        this.embedModal.classList.add('show');
        this.settingsDropdown.style.display = 'none';
    }

    async copyEmbedCode() {
        try {
            await navigator.clipboard.writeText(this.embedCode.value);
            this.copyEmbedBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyEmbedBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            this.embedCode.select();
            document.execCommand('copy');
            this.copyEmbedBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyEmbedBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        }
    }

    downloadTemplate(type) {
        const templatePath = `templates/${type}_template.csv`;
        
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = templatePath;
        link.download = `${type}_template.csv`;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Authentication methods
    checkAuthStatus() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, check if they have admin access
                this.checkAdminAccess(user);
            } else {
                // User is not signed in, redirect to login
                window.location.href = 'login.html';
            }
        });
    }

    async checkAdminAccess(user) {
        try {
            const userDoc = await this.db.collection('admin_users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                // User is not authorized, sign them out and redirect
                await this.auth.signOut();
                window.location.href = 'login.html';
                return;
            }
            
            const userData = userDoc.data();
            this.currentUser = { ...userData, uid: user.uid };
            
            // Update UI to show current user
            this.updateUserInfo();
            
        } catch (error) {
            console.error('Error checking admin access:', error);
            await this.auth.signOut();
            window.location.href = 'login.html';
        }
    }

    updateUserInfo() {
        // Add user info to the header or sidebar
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div class="user-avatar">
                <img src="${this.currentUser.photoURL || 'https://via.placeholder.com/32'}" alt="${this.currentUser.displayName || this.currentUser.email}" />
            </div>
            <div class="user-details">
                <div class="user-name">${this.currentUser.displayName || this.currentUser.email}</div>
                <div class="user-role">${this.currentUser.role || 'admin'}</div>
            </div>
            <button onclick="adminPanel.signOut()" class="btn btn-sm btn-outline">Sign Out</button>
        `;
        
        // Add to sidebar footer
        const sidebarFooter = document.querySelector('.sidebar-footer');
        sidebarFooter.insertBefore(userInfo, sidebarFooter.firstChild);
    }

    async signOut() {
        try {
            await this.auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // User invitation methods
    showInviteUserModal() {
        document.getElementById('inviteUserModal').classList.add('show');
        this.settingsDropdown.style.display = 'none';
        this.loadTeamMembers();
    }

    async loadTeamMembers() {
        try {
            const teamMembers = await this.db.collection('admin_users').get();
            const teamMembersList = document.getElementById('teamMembersList');
            
            if (teamMembers.empty) {
                teamMembersList.innerHTML = '<p>No team members found.</p>';
                return;
            }
            
            teamMembersList.innerHTML = teamMembers.docs.map(doc => {
                const user = doc.data();
                return `
                    <div class="team-member-item">
                        <div class="member-info">
                            <div class="member-name">${user.displayName || user.email}</div>
                            <div class="member-role">${user.role || 'admin'}</div>
                            <div class="member-status">${user.status || 'active'}</div>
                        </div>
                        <div class="member-actions">
                            <button onclick="adminPanel.removeUser('${doc.id}')" class="btn btn-sm btn-danger">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading team members:', error);
            document.getElementById('teamMembersList').innerHTML = '<p>Error loading team members.</p>';
        }
    }

    async inviteUser(e) {
        e.preventDefault();
        
        const email = document.getElementById('inviteEmail').value;
        const role = document.getElementById('inviteRole').value;
        const message = document.getElementById('inviteMessage').value;
        
        try {
            // Create invitation document
            await this.db.collection('user_invitations').add({
                email: email,
                role: role,
                invitedBy: this.currentUser.uid,
                invitedAt: new Date(),
                status: 'pending',
                message: message || 'Welcome to the Business Coach Academy admin panel!'
            });
            
            // Send invitation email (this would typically be done server-side)
            await this.sendInvitationEmail(email, role, message);
            
            this.showSuccess(`Invitation sent to ${email}`);
            document.getElementById('inviteUserForm').reset();
            this.closeModal('inviteUserModal');
            this.loadTeamMembers();
            
        } catch (error) {
            console.error('Error sending invitation:', error);
            this.showError('Failed to send invitation. Please try again.');
        }
    }

    async sendInvitationEmail(email, role, message) {
        // In a real implementation, this would call a server-side function
        // For now, we'll just log the invitation details
        console.log('Invitation details:', {
            email,
            role,
            message,
            loginUrl: `${window.location.origin}/login.html`
        });
        
        // You could integrate with services like:
        // - SendGrid
        // - AWS SES
        // - Firebase Functions with nodemailer
        // - Or any other email service
    }

    async removeUser(userId) {
        if (!confirm('Are you sure you want to remove this user?')) {
            return;
        }
        
        try {
            await this.db.collection('admin_users').doc(userId).delete();
            this.showSuccess('User removed successfully');
            this.loadTeamMembers();
        } catch (error) {
            console.error('Error removing user:', error);
            this.showError('Failed to remove user. Please try again.');
        }
    }
}

// Global function for modal closing
function closeModal(modalId) {
    adminPanel.closeModal(modalId);
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
    
    // Ensure all modals are hidden on page load
    const modalIds = ['coachModal', 'winModal', 'assetModal', 'embedModal', 'importModal', 'columnModal', 'inviteUserModal'];
    modalIds.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    });
});