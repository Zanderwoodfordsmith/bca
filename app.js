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
        this.keywordSearch = document.getElementById('keywordSearch');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.mediaTypeFilter = document.getElementById('mediaTypeFilter');
        this.coachFilter = document.getElementById('coachFilter');
        this.timeFilter = document.getElementById('timeFilter');
        this.clearFilters = document.getElementById('clearFilters');
    }

    bindEvents() {
        this.loadMoreBtn.addEventListener('click', () => this.loadMoreTestimonials());
        this.keywordSearch.addEventListener('input', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.mediaTypeFilter.addEventListener('change', () => this.applyFilters());
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
                console.log('   - win_title:', winData.win_title);
                console.log('   - win_description:', winData.win_description);
                console.log('   - win_category:', winData.win_category);
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
                
                // Use the new media fields from wins instead of proof_assets
                console.log('📎 Win has media:', winData.media_type, winData.media_url);
                
                const testimonial = {
                    win: winData,
                    coach: coachData,
                    media: {
                        type: winData.media_type,
                        url: winData.media_url,
                        title: winData.media_title,
                        description: winData.media_description,
                        format: winData.media_format
                    }
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
                media: {
                    type: 'Written',
                    url: 'https://example.com/testimonial1',
                    title: 'Client Testimonial',
                    description: 'The coaching process was life-changing for me. Sarah helped me gain clarity and confidence to pursue my dream career.',
                    format: 'Text'
                }
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
                media: {
                    type: 'Video',
                    url: 'https://youtube.com/watch?v=example',
                    title: 'Success Story Video',
                    description: 'A heartfelt video testimonial from a client who doubled their revenue in 6 months.',
                    format: 'MP4'
                }
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
                media: {
                    type: 'Image',
                    url: 'https://example.com/success-post.jpg',
                    title: 'Success Celebration',
                    description: 'A celebratory social media post showcasing the client\'s transformation.',
                    format: 'Image'
                }
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
        const { win, coach, media } = testimonial;
        const initials = `${coach.first_name[0]}${coach.last_name[0]}`;
        
        // Only show join date if it's valid and not the default date
        const joinDate = coach.join_date ? new Date(coach.join_date.seconds ? coach.join_date.seconds * 1000 : coach.join_date) : null;
        const isValidJoinDate = joinDate && joinDate.getFullYear() > 2000; // Not the default 1999 date
        
        const winDate = win.win_date ? new Date(win.win_date.seconds ? win.win_date.seconds * 1000 : win.win_date).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        }) : 'Date needed';
        
        // Enhanced media display - show media with better formatting, hide file names
        const mediaContent = media && media.url && media.url.trim() !== '' ? `
            <div class="media-section">
                <h5 class="media-title">📎 Supporting Evidence</h5>
                <div class="media-container">
                    ${(() => {
                        let mediaHTML = '';
                        
                        // Show media content based on type and URL
                        switch (media.type) {
                            case 'Video':
                                // Check if it's a YouTube or Vimeo URL
                                const isYouTube = media.url.includes('youtube.com') || media.url.includes('youtu.be');
                                const isVimeo = media.url.includes('vimeo.com');
                                
                                if (isYouTube) {
                                    // Extract YouTube video ID
                                    const youtubeId = media.url.includes('youtu.be') 
                                        ? media.url.split('youtu.be/')[1]?.split('?')[0]
                                        : media.url.split('v=')[1]?.split('&')[0];
                                    
                                    if (youtubeId) {
                                        mediaHTML = `<div class="media-item">
                                            <iframe width="100%" height="225" 
                                                src="https://www.youtube.com/embed/${youtubeId}" 
                                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowfullscreen style="border-radius: 8px; max-width: 400px;">
                                            </iframe>
                                        </div>`;
                                    } else {
                                        mediaHTML = `<div class="media-item">
                                            <a href="${media.url}" target="_blank" class="media-link">🎥 Watch Video</a>
                                        </div>`;
                                    }
                                } else if (isVimeo) {
                                    // Extract Vimeo video ID
                                    const vimeoId = media.url.split('vimeo.com/')[1]?.split('?')[0];
                                    
                                    if (vimeoId) {
                                        mediaHTML = `<div class="media-item">
                                            <iframe width="100%" height="225" 
                                                src="https://player.vimeo.com/video/${vimeoId}" 
                                                frameborder="0" allow="autoplay; fullscreen; picture-in-picture" 
                                                allowfullscreen style="border-radius: 8px; max-width: 400px;">
                                            </iframe>
                                        </div>`;
                                    } else {
                                        mediaHTML = `<div class="media-item">
                                            <a href="${media.url}" target="_blank" class="media-link">🎥 Watch Video</a>
                                        </div>`;
                                    }
                                } else {
                                    // Direct video file
                                    const videoExtension = media.url.split('.').pop().toLowerCase();
                                    let videoType = 'video/mp4'; // default
                                    
                                    if (videoExtension === 'webm') videoType = 'video/webm';
                                    else if (videoExtension === 'mov') videoType = 'video/quicktime';
                                    else if (videoExtension === 'avi') videoType = 'video/x-msvideo';
                                    else if (videoExtension === 'wmv') videoType = 'video/x-ms-wmv';
                                    
                                    mediaHTML = `<div class="media-item">
                                        <video controls preload="metadata" style="width: 100%; max-width: 400px; border-radius: 8px;">
                                            <source src="${media.url}" type="${videoType}">
                                            <source src="${media.url}" type="video/mp4">
                                            <p>Your browser doesn't support HTML5 video. <a href="${media.url}" target="_blank">Watch video</a> instead.</p>
                                        </video>
                                    </div>`;
                                }
                                break;
                            case 'Image':
                            case 'Screenshot':
                                mediaHTML = `<div class="media-item">
                                    <img src="${media.url}" alt="Supporting evidence" style="width: 100%; max-width: 400px; border-radius: 8px;" />
                                </div>`;
                                break;
                            case 'Written':
                                mediaHTML = `<div class="media-item">
                                    <div class="quote-content" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
                                        ${media.description ? `<p style="margin: 0; font-style: italic;">"${media.description}"</p>` : `<a href="${media.url}" target="_blank" class="quote-link">📄 Read Testimonial</a>`}
                                    </div>
                                </div>`;
                                break;
                            case 'Interview':
                                mediaHTML = `<div class="media-item">
                                    <a href="${media.url}" target="_blank" class="media-link">🎤 Listen to Interview</a>
                                </div>`;
                                break;
                            case 'Audio':
                                mediaHTML = `<div class="media-item">
                                    <audio controls style="width: 100%; max-width: 400px;">
                                        <source src="${media.url}" type="audio/mpeg">
                                        <source src="${media.url}" type="audio/wav">
                                        <a href="${media.url}" target="_blank">Listen to audio</a>
                                    </audio>
                                </div>`;
                                break;
                            case 'Document':
                                mediaHTML = `<div class="media-item">
                                    <a href="${media.url}" target="_blank" class="media-link">📄 View Document</a>
                                </div>`;
                                break;
                            default:
                                mediaHTML = `<div class="media-item">
                                    <a href="${media.url}" target="_blank" class="media-link">📄 View Evidence</a>
                                </div>`;
                        }
                        
                        return mediaHTML;
                    })()}
                </div>
            </div>
        ` : '';

        return `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="coach-avatar">${initials}</div>
                    <div class="coach-info">
                        <h3>${coach.first_name} ${coach.last_name}</h3>
                        ${isValidJoinDate ? `<div class="join-date">Member since ${joinDate.toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                        })}</div>` : ''}
                    </div>
                </div>
                
                <div class="win-category">${win.win_category || 'Achievement'}</div>
                
                <h4 class="win-title">${win.win_title || 'Untitled Win'}</h4>
                <p class="win-description">${win.win_description || 'No description provided'}</p>
                
                ${mediaContent}
                
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

        // Keyword search
        const keyword = this.keywordSearch.value.toLowerCase();
        if (keyword) {
            this.filteredTestimonials = this.filteredTestimonials.filter(t => {
                const coachName = (t.coach.first_name + ' ' + t.coach.last_name).toLowerCase();
                const winTitle = (t.win.win_title || '').toLowerCase();
                const winDescription = (t.win.win_description || '').toLowerCase();
                const winCategory = (t.win.win_category || '').toLowerCase();
                const mediaDescription = (t.media?.description || '').toLowerCase();
                const mediaTitle = (t.media?.title || '').toLowerCase();
                
                return coachName.includes(keyword) ||
                       winTitle.includes(keyword) ||
                       winDescription.includes(keyword) ||
                       winCategory.includes(keyword) ||
                       mediaDescription.includes(keyword) ||
                       mediaTitle.includes(keyword);
            });
        }

        // Category filter
        const selectedCategory = this.categoryFilter.value;
        if (selectedCategory) {
            this.filteredTestimonials = this.filteredTestimonials.filter(t => t.win.win_category === selectedCategory);
        }

        // Media type filter
        const selectedMediaType = this.mediaTypeFilter.value;
        if (selectedMediaType) {
            this.filteredTestimonials = this.filteredTestimonials.filter(t => t.media?.type === selectedMediaType);
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
            
            this.filteredTestimonials = this.filteredTestimonials.filter(t => {
                const winDate = t.win.win_date?.seconds ? new Date(t.win.win_date.seconds * 1000) : new Date(t.win.win_date);
                return winDate >= filterDate;
            });
        }

        this.displayTestimonials(this.filteredTestimonials.slice(0, this.pageSize));
        this.updateLoadMoreButton();
    }

    clearAllFilters() {
        this.keywordSearch.value = '';
        this.categoryFilter.value = '';
        this.mediaTypeFilter.value = '';
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
