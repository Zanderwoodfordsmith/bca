class AdminPanel {
    constructor() {
        console.log('AdminPanel starting...');
        this.coaches = [];
        this.wins = [];
        this.assets = [];
        this.currentSection = 'coaches';
        
        // Initialize Firebase
        this.db = window.db || firebase.firestore();
        
        this.initializeElements();
        this.bindEvents();
        this.loadAllData();
    }

    initializeElements() {
        this.coachesTab = document.getElementById('coachesTab');
        this.winsTab = document.getElementById('winsTab');
        this.assetsTab = document.getElementById('assetsTab');
        
        this.coachesSection = document.getElementById('coachesSection');
        this.winsSection = document.getElementById('winsSection');
        this.assetsSection = document.getElementById('assetsSection');
        
        this.coachesTableBody = document.getElementById('coachesTableBody');
        this.winsTableBody = document.getElementById('winsTableBody');
        this.assetsTableBody = document.getElementById('assetsTableBody');
        
        this.searchInput = document.getElementById('searchInput');
    }

    bindEvents() {
        this.coachesTab.addEventListener('click', () => this.switchTab('coaches'));
        this.winsTab.addEventListener('click', () => this.switchTab('wins'));
        this.assetsTab.addEventListener('click', () => this.switchTab('assets'));
        
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderCurrentSection();
        });
    }

    switchTab(section) {
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.getElementById(section + 'Tab').classList.add('active');
        
        document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section + 'Section').classList.add('active');
        
        this.currentSection = section;
        this.renderCurrentSection();
    }

    async loadAllData() {
        try {
            console.log('Loading all data...');
            await Promise.all([
                this.loadCoaches(),
                this.loadWins(),
                this.loadAssets()
            ]);
            console.log('All data loaded');
            this.renderCurrentSection();
        } catch (error) {
            console.error('Error loading data:', error);
            // Use sample data if Firebase fails
            this.coaches = [
                { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' }
            ];
            this.wins = [
                { id: '1', coach_id: '1', win_title: 'Sample Win 1', win_date: { seconds: Date.now() / 1000 } },
                { id: '2', coach_id: '2', win_title: 'Sample Win 2', win_date: { seconds: Date.now() / 1000 } }
            ];
            this.assets = [];
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

    async loadAssets() {
        try {
            const snapshot = await this.db.collection('proof_assets').get();
            this.assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Assets loaded:', this.assets.length);
        } catch (error) {
            console.error('Error loading assets:', error);
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
            case 'assets':
                this.renderAssetsTable();
                break;
        }
    }

    renderCoachesTable() {
        console.log('Rendering coaches table, count:', this.coaches.length);
        
        if (this.coaches.length === 0) {
            this.coachesTableBody.innerHTML = '<tr><td colspan="3" class="loading">Loading coaches...</td></tr>';
            return;
        }
        
        let data = this.coaches;
        
        if (this.searchTerm) {
            data = data.filter(coach => 
                (coach.first_name + ' ' + coach.last_name).toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        if (data.length === 0) {
            this.coachesTableBody.innerHTML = '<tr><td colspan="3" class="loading">No coaches found</td></tr>';
            return;
        }

        this.coachesTableBody.innerHTML = data.map(coach => {
            const linkedWins = this.wins.filter(win => win.coach_id === coach.id);
            
            return `
            <tr data-id="${coach.id}" onclick="adminPanel.showCoachDetail('${coach.id}')" style="cursor: pointer;">
                <td class="checkbox-col" onclick="event.stopPropagation()">
                    <input type="checkbox" class="row-checkbox" data-id="${coach.id}">
                </td>
                <td class="col-name">${coach.first_name || ''} ${coach.last_name || ''}</td>
                <td class="col-wins-count">${linkedWins.length}</td>
            </tr>
            `;
        }).join('');
    }

    renderWinsTable() {
        if (this.wins.length === 0) {
            this.winsTableBody.innerHTML = '<tr><td colspan="4" class="loading">No wins found</td></tr>';
            return;
        }
        
        this.winsTableBody.innerHTML = this.wins.map(win => {
            const coach = this.coaches.find(c => c.id === win.coach_id);
            const coachName = coach ? `${coach.first_name} ${coach.last_name}` : 'Unknown Coach';
            
            return `
            <tr data-id="${win.id}">
                <td class="checkbox-col">
                    <input type="checkbox" class="row-checkbox" data-id="${win.id}">
                </td>
                <td class="col-coach">${coachName}</td>
                <td class="col-title">${win.win_title}</td>
                <td class="col-date">${this.formatDate(win.win_date)}</td>
            </tr>
            `;
        }).join('');
    }

    renderAssetsTable() {
        if (this.assets.length === 0) {
            this.assetsTableBody.innerHTML = '<tr><td colspan="3" class="loading">No assets found</td></tr>';
            return;
        }
        
        this.assetsTableBody.innerHTML = this.assets.map(asset => {
            const win = this.wins.find(w => w.id === asset.win_id);
            const winTitle = win ? win.win_title : 'Unknown Win';
            
            return `
            <tr data-id="${asset.id}">
                <td class="checkbox-col">
                    <input type="checkbox" class="row-checkbox" data-id="${asset.id}">
                </td>
                <td class="col-win">${winTitle}</td>
                <td class="col-title">${asset.asset_title}</td>
            </tr>
            `;
        }).join('');
    }

    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
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
            <button onclick="adminPanel.showMainView()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">
                ← Back to Coaches
            </button>
            
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
                coachWins.map(win => `
                    <div style="background: #f9fafb; padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                        <h3 style="margin: 0 0 5px 0; color: #1f2937;">${win.win_title || 'Untitled'}</h3>
                        <p style="margin: 0; color: #6b7280;">Category: ${win.win_category || 'Uncategorized'} | Date: ${this.formatDate(win.win_date)}</p>
                    </div>
                `).join('')
            }
        `;
        
        document.body.appendChild(detailPage);
    }

    showMainView() {
        const detailPage = document.getElementById('coachDetailPage');
        if (detailPage) {
            detailPage.remove();
        }
        
        const mainContent = document.querySelector('.admin-main');
        mainContent.style.display = 'block';
        
        document.getElementById('coachesSection').classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating AdminPanel...');
    window.adminPanel = new AdminPanel();
    console.log('AdminPanel created:', window.adminPanel);
});
