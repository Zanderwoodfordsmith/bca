class ProofWall {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 20;
        this.allTestimonials = [];
        this.displayedCount = 0;
        this.filteredTestimonials = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadTestimonials();
    }

    initializeElements() {
        this.proofWall = document.getElementById('proofWall');
        this.loading = document.getElementById('loading');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.coachFilter = document.getElementById('coachFilter');
        this.timeFilter = document.getElementById('timeFilter');
        this.clearFilters = document.getElementById('clearFilters');
    }

    bindEvents() {
        this.loadMoreBtn.addEventListener('click', () => this.loadMoreTestimonials());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.coachFilter.addEventListener('change', () => this.applyFilters());
        this.timeFilter.addEventListener('change', () => this.applyFilters());
        this.clearFilters.addEventListener('click', () => this.clearAllFilters());
    }

    async loadTestimonials() {
        try {
            console.log('🚀 Starting to load testimonials...');
            this.showLoading();
            
            // Fetch testimonials with coaches and assets
            console.log('📡 Fetching testimonials from Firebase...');
            const testimonials = await this.fetchTestimonialsWithDetails();
            console.log('📦 Testimonials fetched:', testimonials);
            
            this.allTestimonials = testimonials;
            this.filteredTestimonials = [...this.allTestimonials];
            
            console.log('🖼️ Displaying testimonials...');
            this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
            this.populateCoachFilter();
            this.updateLoadMoreButton();
            
            console.log('✅ Load testimonials completed successfully');
            
        } catch (error) {
            console.error('❌ Error loading testimonials:', error);
            console.error('❌ Error details:', error.message);
            console.error('❌ Error stack:', error.stack);
            this.showError('Failed to load testimonials. Please check your Firebase configuration. Error: ' + error.message);
        }
    }

    async fetchTestimonialsWithDetails() {
        const testimonials = [];
        
        try {
            console.log('🔗 Testing Firebase connection...');
            
            // Test Firebase connection first
            if (!db) {
                throw new Error('Firebase not initialized - check firebase-config.js');
            }
            console.log('✅ Firebase connection OK');
            
            console.log('Fetching testimonials from Firebase...');
            
            // First, let's get ALL wins to see what we have
            const allWinsSnapshot = await db.collection('wins').get();
            console.log('🔍 Total wins found:', allWinsSnapshot.docs.length);
            
            // Log all win data to see what fields exist
            allWinsSnapshot.docs.forEach(doc => {
                const winData = { id: doc.id, ...doc.data() };
                console.log('📋 Win data:', winData);
                console.log('   - show_on_wall:', winData.show_on_wall);
                console.log('   - win_date:', winData.win_date);
                console.log('   - coach_id:', winData.coach_id);
            });
            
            // Get all wins without ordering to avoid index requirement
            const winsQuery = db.collection('wins');
            
            const winsSnapshot = await winsQuery.get();
            console.log('🎯 All wins found:', winsSnapshot.docs.length);
            
            // Sort wins by date on the client side (newest first)
            const sortedWins = winsSnapshot.docs.sort((a, b) => {
                const dateA = a.data().win_date?.toDate ? a.data().win_date.toDate() : new Date(a.data().win_date?.seconds * 1000 || 0);
                const dateB = b.data().win_date?.toDate ? b.data().win_date.toDate() : new Date(b.data().win_date?.seconds * 1000 || 0);
                return dateB - dateA; // Newest first
            });
            
            console.log('📅 Sorted wins by date:', sortedWins.length);

            for (const winDoc of sortedWins) {
                const winData = { id: winDoc.id, ...winDoc.data() };
                console.log('🔄 Processing win:', winData);
                
                // Fetch coach details
                console.log('👤 Looking for coach with ID:', winData.coach_id);
                const coachDoc = await db.collection('coaches').doc(winData.coach_id).get();
                if (!coachDoc.exists) {
                    console.log('❌ Coach not found for win:', winData.coach_id);
                    continue;
                }
                
                const coachData = { id: coachDoc.id, ...coachDoc.data() };
                console.log('✅ Found coach:', coachData);
                
                // Fetch all assets for this win (no asset-level approval needed)
                console.log('📎 Looking for assets for win ID:', winDoc.id);
                const assetsQuery = db.collection('proof_assets').where('win_id', '==', winDoc.id);
                
                const assetsSnapshot = await assetsQuery.get();
                console.log('📎 Assets found for win:', assetsSnapshot.docs.length);
                
                const assets = assetsSnapshot.docs.map(doc => {
                    const assetData = { id: doc.id, ...doc.data() };
                    console.log('   📎 Asset:', assetData);
                    return assetData;
                });
                
                const testimonial = {
                    win: winData,
                    coach: coachData,
                    assets: assets
                };
                
                console.log('✅ Created testimonial:', testimonial);
                testimonials.push(testimonial);
            }
            
            console.log('Total testimonials assembled:', testimonials.length);
            
        } catch (error) {
            console.error('❌ Error fetching testimonials:', error);
            console.error('❌ Error details:', error.message);
            console.log('🔄 Returning sample data due to error');
            // Return sample data if Firebase is not configured
            return this.getSampleData();
        }
        
        return testimonials;
    }

    getSampleData() {
        return [
            {
                win: {
                    id: '1',
                    win_title: 'First Client Signed',
                    win_description: 'Successfully signed my first paying client after 3 months of building my coaching practice. The client is excited to start their transformation journey.',
                    win_date: new Date('2024-01-15'),
                    win_category: 'First Client',
                    verification_status: 'verified'
                },
                coach: {
                    id: '1',
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    join_date: new Date('2023-10-01'),
                    bio: 'Transformational life coach specializing in career transitions'
                },
                assets: [
                    {
                        asset_type: 'Written Quote',
                        asset_format: 'Text',
                        asset_title: 'Client Testimonial',
                        asset_description: 'The coaching process was life-changing for me. Sarah helped me gain clarity and confidence to pursue my dream career.'
                    }
                ]
            },
            {
                win: {
                    id: '2',
                    win_title: 'Revenue Milestone Reached',
                    win_description: 'Hit my first $10K month in coaching revenue! This milestone represents months of hard work, learning, and serving clients.',
                    win_date: new Date('2024-01-10'),
                    win_category: 'Revenue Milestone',
                    verification_status: 'verified'
                },
                coach: {
                    id: '2',
                    first_name: 'Michael',
                    last_name: 'Chen',
                    join_date: new Date('2023-08-15'),
                    bio: 'Business coach focused on helping entrepreneurs scale their ventures'
                },
                assets: [
                    {
                        asset_type: 'Video Testimonial',
                        asset_format: 'MP4',
                        asset_title: 'Success Story Video',
                        asset_description: 'A heartfelt video testimonial from a client who doubled their revenue in 6 months.'
                    }
                ]
            },
            {
                win: {
                    id: '3',
                    win_title: 'Breakthrough Session',
                    win_description: 'Had an incredible breakthrough session with a client who finally overcame their limiting beliefs about money. The transformation was immediate and powerful.',
                    win_date: new Date('2024-01-08'),
                    win_category: 'Breakthrough',
                    verification_status: 'verified'
                },
                coach: {
                    id: '3',
                    first_name: 'Emily',
                    last_name: 'Rodriguez',
                    join_date: new Date('2023-09-20'),
                    bio: 'Mindset and abundance coach helping people overcome financial blocks'
                },
                assets: [
                    {
                        asset_type: 'Social Post',
                        asset_format: 'Image',
                        asset_title: 'Success Celebration',
                        asset_description: 'A celebratory social media post showcasing the client\'s transformation.'
                    }
                ]
            }
        ];
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
        const { win, coach, assets } = testimonial;
        const initials = `${coach.first_name[0]}${coach.last_name[0]}`;
        
        // Only show join date if it's valid and not the default date
        const joinDate = coach.join_date ? new Date(coach.join_date.seconds ? coach.join_date.seconds * 1000 : coach.join_date) : null;
        const isValidJoinDate = joinDate && joinDate.getFullYear() > 2000; // Not the default 1999 date
        
        const winDate = win.win_date ? new Date(win.win_date.seconds ? win.win_date.seconds * 1000 : win.win_date).toLocaleDateString() : 'Date needed';
        
        // Simplified asset display - just show the media, no redundant titles/descriptions
        const assetContent = assets.map(asset => {
            if (asset.asset_url && asset.asset_url.trim() !== '') {
                switch (asset.asset_type) {
                    case 'Video Testimonial':
                        return `<div class="asset-content">
                            <video controls>
                                <source src="${asset.asset_url}" type="video/mp4">
                                Video testimonial available
                            </video>
                        </div>`;
                    case 'Social Post':
                        return `<div class="asset-content">
                            <img src="${asset.asset_url}" alt="Social post" />
                        </div>`;
                    case 'Case Study':
                        return `<div class="asset-content">
                            <a href="${asset.asset_url}" target="_blank" class="case-study-link">📊 View Case Study</a>
                        </div>`;
                    default:
                        return `<div class="asset-content">
                            <a href="${asset.asset_url}" target="_blank" class="asset-link">📄 View Asset</a>
                        </div>`;
                }
            }
            return ''; // Don't show anything if no URL
        }).join('');

        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="coach-avatar">${initials}</div>
                    <div class="coach-info">
                        <h3>${coach.first_name} ${coach.last_name}</h3>
                        ${isValidJoinDate ? `<div class="join-date">Member since ${joinDate.toLocaleDateString()}</div>` : ''}
                    </div>
                </div>
                
                <div class="win-category">${win.win_category}</div>
                
                <h4 class="win-title">${win.win_title}</h4>
                <p class="win-description">${win.win_description}</p>
                
                ${assetContent}
                
                <div class="win-date">
                    ${winDate}
                    <span class="verification-badge verified">✓ Verified</span>
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
        if (this.displayedCount >= this.filteredTestimonials.length) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'block';
        }
    }


    showEmbedModal() {
        const currentURL = window.location.href;
        const embedCode = `<iframe src="${currentURL}" width="100%" height="600" frameborder="0" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"></iframe>`;
        
        this.embedCode.value = embedCode;
        this.embedModal.style.display = 'block';
    }

    hideEmbedModal() {
        this.embedModal.style.display = 'none';
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

    showLoading() {
        this.loading.style.display = 'block';
        this.proofWall.innerHTML = '';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        this.proofWall.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fed7d7; color: #c53030; border-radius: 8px; margin: 20px 0;">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <p style="margin-top: 15px; font-size: 0.9rem;">
                    Please check your Firebase configuration in firebase-config.js
                </p>
            </div>
        `;
    }

    showEmptyState() {
        this.proofWall.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <h3>🎉 No testimonials yet</h3>
                <p>Be the first to share your coaching success story!</p>
            </div>
        `;
    }

    populateCoachFilter() {
        const uniqueCoaches = [...new Set(this.allTestimonials.map(t => t.coach.first_name + ' ' + t.coach.last_name))];
        this.coachFilter.innerHTML = '<option value="">All Coaches</option>';
        uniqueCoaches.forEach(coachName => {
            this.coachFilter.innerHTML += `<option value="${coachName}">${coachName}</option>`;
        });
    }

    applyFilters() {
        this.filteredTestimonials = [...this.allTestimonials];

        // Category filter
        const selectedCategory = this.categoryFilter.value;
        if (selectedCategory) {
            this.filteredTestimonials = this.filteredTestimonials.filter(t => t.win.win_category === selectedCategory);
        }

        // Coach filter
        const selectedCoach = this.coachFilter.value;
        if (selectedCoach) {
            this.filteredTestimonials = this.filteredTestimonials.filter(t => 
                (t.coach.first_name + ' ' + t.coach.last_name) === selectedCoach
            );
        }

        // Time filter
        const selectedTime = this.timeFilter.value;
        if (selectedTime) {
            const now = new Date();
            const filterDate = new Date();
            
            switch (selectedTime) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            this.filteredTestimonials = this.filteredTestimonials.filter(t => 
                new Date(t.win.win_date.seconds * 1000) >= filterDate
            );
        }

        this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
        this.updateLoadMoreButton();
    }

    clearAllFilters() {
        this.categoryFilter.value = '';
        this.coachFilter.value = '';
        this.timeFilter.value = '';
        this.filteredTestimonials = [...this.allTestimonials];
        this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
        this.updateLoadMoreButton();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProofWall();
});
