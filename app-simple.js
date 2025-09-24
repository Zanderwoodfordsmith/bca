class ProofWall {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 9;
        this.allTestimonials = [];
        this.displayedCount = 0;
        this.filteredTestimonials = [];
        
        this.initializeElements();
        this.loadTestimonials();
    }

    initializeElements() {
        this.proofWall = document.getElementById('proofWall');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.keywordSearch = document.getElementById('keywordSearch');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.mediaTypeFilter = document.getElementById('mediaTypeFilter');
        this.coachFilter = document.getElementById('coachFilter');
        this.timeFilter = document.getElementById('timeFilter');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        // Check if elements exist before setting up listeners
        if (this.keywordSearch) this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.keywordSearch) this.keywordSearch.addEventListener('input', () => this.filterTestimonials());
        if (this.categoryFilter) this.categoryFilter.addEventListener('change', () => this.filterTestimonials());
        if (this.mediaTypeFilter) this.mediaTypeFilter.addEventListener('change', () => this.filterTestimonials());
        if (this.coachFilter) this.coachFilter.addEventListener('change', () => this.filterTestimonials());
        if (this.timeFilter) this.timeFilter.addEventListener('change', () => this.filterTestimonials());
        if (this.loadMoreBtn) this.loadMoreBtn.addEventListener('click', () => this.loadMoreTestimonials());
        if (this.clearAllBtn) this.clearAllBtn.addEventListener('click', () => this.clearAllFilters());
    }

    async loadTestimonials() {
        try {
            this.showLoading();
            console.log('🚀 Starting to load media files...');
            
            // Fetch media files directly
            console.log('📡 Fetching media files from Firebase...');
            const testimonials = await this.fetchMediaFiles();
            console.log('📦 Media files fetched:', testimonials);
            
            this.allTestimonials = testimonials;
            this.filteredTestimonials = [...this.allTestimonials];
            
            console.log('🖼️ Displaying media files...');
            this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
            this.populateCoachFilter();
            this.updateLoadMoreButton();
            
            console.log('✅ Load media files completed successfully');
            
        } catch (error) {
            console.error('❌ Error loading media files:', error);
            this.showError('Failed to load media files. Please check your Firebase configuration.');
        }
    }

    async fetchMediaFiles() {
        const testimonials = [];
        
        try {
            console.log('🔗 Testing Firebase connection...');
            
            if (!db) {
                throw new Error('Firebase not initialized');
            }
            console.log('✅ Firebase connection OK');
            
            console.log('Fetching media files directly...');
            
            // Get all media files directly
            const mediaSnapshot = await db.collection('media').get();
            console.log('🔍 Total media files in database:', mediaSnapshot.docs.length);
            
            // Process each media file
            for (const mediaDoc of mediaSnapshot.docs) {
                const mediaData = { id: mediaDoc.id, ...mediaDoc.data() };
                console.log('🔄 Processing media:', mediaData);
                
                // Get the associated win
                let winData = null;
                if (mediaData.win_id) {
                    try {
                        const winDoc = await db.collection('wins').doc(mediaData.win_id).get();
                        if (winDoc.exists) {
                            winData = { id: winDoc.id, ...winDoc.data() };
                            console.log('✅ Found associated win:', winData.win_title);
                        }
                    } catch (error) {
                        console.log('❌ Error fetching win for media:', error);
                    }
                }
                
                // Get the associated coach
                let coachData = null;
                if (winData && winData.coach_id) {
                    try {
                        const coachDoc = await db.collection('coaches').doc(winData.coach_id).get();
                        if (coachDoc.exists) {
                            coachData = { id: coachDoc.id, ...coachDoc.data() };
                            console.log('✅ Found associated coach:', coachData.first_name, coachData.last_name);
                        }
                    } catch (error) {
                        console.log('❌ Error fetching coach for media:', error);
                    }
                }
                
                // Create testimonial from media
                const testimonial = {
                    win: winData || { win_title: 'Media File', win_description: '' },
                    coach: coachData || { first_name: 'Unknown', last_name: 'Coach' },
                    media: {
                        url: mediaData.url || mediaData.file_url || mediaData.image_url || '',
                        type: mediaData.type || 'Image',
                        title: mediaData.title || '',
                        description: mediaData.description || '',
                        format: mediaData.format || ''
                    }
                };
                
                console.log('✅ Created testimonial from media:', testimonial.media.url);
                testimonials.push(testimonial);
            }
            
            console.log('Total media testimonials assembled:', testimonials.length);
            
        } catch (error) {
            console.error('❌ Error fetching media:', error);
            return [];
        }
        
        return testimonials;
    }

    displayTestimonials(testimonials) {
        this.hideLoading();
        
        if (testimonials.length === 0) {
            this.showEmptyState();
            return;
        }

        const html = testimonials.map(testimonial => this.createTestimonialHTML(testimonial)).join('');
        this.proofWall.innerHTML = html;
        this.displayedCount = testimonials.length;
    }

    createTestimonialHTML(testimonial) {
        const { win, coach, media } = testimonial;
        const initials = `${coach.first_name[0]}${coach.last_name[0]}`;
        
        // Simple image display
        const imageHTML = media && media.url ? `
            <div class="win-image" style="margin-top: 15px;">
                <img src="${media.url}" 
                     alt="${media.title || 'Media file'}" 
                     style="width: 100%; max-width: 500px; border-radius: 8px; border: 1px solid #ddd;" 
                     onerror="console.error('❌ Media failed to load:', this.src)" 
                     onload="console.log('✅ Media loaded successfully:', this.src)" />
            </div>
        ` : '<div style="margin-top: 15px; color: #666;">No media file</div>';
        
        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="coach-avatar">${initials}</div>
                    <div class="coach-info">
                        <h3 class="coach-name">${coach.first_name} ${coach.last_name}</h3>
                    </div>
                </div>
                
                <div class="testimonial-content">
                    <h4 class="win-title">${win.win_title}</h4>
                    <p class="win-description">${win.win_description || 'No description available.'}</p>
                    ${imageHTML}
                </div>
            </div>
        `;
    }

    loadMoreTestimonials() {
        const nextBatch = this.filteredTestimonials.slice(
            this.displayedCount, 
            this.displayedCount + this.pageSize
        );
        
        if (nextBatch.length > 0) {
            const newHTML = nextBatch.map(testimonial => this.createTestimonialHTML(testimonial)).join('');
            this.proofWall.insertAdjacentHTML('beforeend', newHTML);
            this.displayedCount += nextBatch.length;
            this.updateLoadMoreButton();
        }
    }

    updateLoadMoreButton() {
        if (!this.loadMoreBtn) return;
        const hasMore = this.displayedCount < this.filteredTestimonials.length;
        this.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }

    filterTestimonials() {
        const keyword = this.keywordSearch ? this.keywordSearch.value.toLowerCase() : '';
        const category = this.categoryFilter ? this.categoryFilter.value : '';
        const mediaType = this.mediaTypeFilter ? this.mediaTypeFilter.value : '';
        const coach = this.coachFilter ? this.coachFilter.value : '';
        const timePeriod = this.timeFilter ? this.timeFilter.value : '';

        this.filteredTestimonials = this.allTestimonials.filter(t => {
            const matchesKeyword = !keyword || 
                t.win.win_title.toLowerCase().includes(keyword) ||
                t.win.win_description.toLowerCase().includes(keyword) ||
                t.coach.first_name.toLowerCase().includes(keyword) ||
                t.coach.last_name.toLowerCase().includes(keyword);

            const matchesCategory = !category || t.win.win_category === category;
            const matchesMediaType = !mediaType || t.media.type === mediaType;
            const matchesCoach = !coach || t.coach.id === coach;

            let matchesTime = true;
            if (timePeriod && timePeriod !== 'all') {
                const winDate = t.win.win_date?.seconds ? new Date(t.win.win_date.seconds * 1000) : new Date(t.win.win_date);
                const filterDate = new Date();
                filterDate.setDate(filterDate.getDate() - parseInt(timePeriod));
                matchesTime = winDate >= filterDate;
            }

            return matchesKeyword && matchesCategory && matchesMediaType && matchesCoach && matchesTime;
        });

        this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
        this.updateLoadMoreButton();
    }

    clearAllFilters() {
        if (this.keywordSearch) this.keywordSearch.value = '';
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.mediaTypeFilter) this.mediaTypeFilter.value = '';
        if (this.coachFilter) this.coachFilter.value = '';
        if (this.timeFilter) this.timeFilter.value = '';
        this.filteredTestimonials = [...this.allTestimonials];
        this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
        this.updateLoadMoreButton();
    }

    populateCoachFilter() {
        if (!this.coachFilter) return;
        const coaches = [...new Set(this.allTestimonials.map(t => t.coach))];
        this.coachFilter.innerHTML = '<option value="">All Coaches</option>' +
            coaches.map(coach => `<option value="${coach.id}">${coach.first_name} ${coach.last_name}</option>`).join('');
    }

    showLoading() {
        if (this.proofWall) this.proofWall.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 18px;">Loading media files...</div>';
    }

    hideLoading() {
        // Loading is hidden when content is displayed
    }

    showEmptyState() {
        if (this.proofWall) this.proofWall.innerHTML = '<div class="empty-state">No media files found.</div>';
    }

    showError(message) {
        if (this.proofWall) this.proofWall.innerHTML = `<div class="error-state">${message}</div>`;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProofWall();
});
