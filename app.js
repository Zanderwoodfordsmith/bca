class ProofWall {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 9;
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
            console.log('📊 Display stats:');
            console.log('  - All testimonials:', this.allTestimonials.length);
            console.log('  - Filtered testimonials:', this.filteredTestimonials.length);
            console.log('  - Page size:', this.pageSize);
            console.log('  - Displaying:', Math.min(this.filteredTestimonials.length, this.pageSize));
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
            
            // Get all wins first to debug
            const allWinsSnapshot = await db.collection('wins').get();
            console.log('🔍 Total wins in database:', allWinsSnapshot.docs.length);
            
            // TEMPORARY: Show Will Walsh for debugging
            const winsToShow = allWinsSnapshot.docs.filter(doc => {
                const winData = doc.data();
                return winData.win_title && winData.win_title.includes('Will Walsh');
            });
            
            console.log('🎯 Wins with media files:', winsToShow.length);
            console.log('📊 Filtering stats:');
            console.log('  - Total wins in database:', allWinsSnapshot.docs.length);
            console.log('  - Wins with media files:', winsToShow.length);
            console.log('  - Wins skipped (no media):', allWinsSnapshot.docs.length - winsToShow.length);
            
            // Debug: Show which wins have media
            console.log('📸 Wins with media files:');
            winsToShow.forEach((doc, index) => {
                const winData = doc.data();
                console.log(`  ${index + 1}. ${winData.win_title} - Media: ${winData.media_url}`);
            });
            
            // Debug: Show Will Walsh's win data specifically
            console.log('🔍 Looking for Will Walsh specifically:');
            allWinsSnapshot.docs.forEach((doc, index) => {
                const winData = doc.data();
                if (winData.win_title && winData.win_title.includes('Will Walsh')) {
                    console.log(`Found Will Walsh win #${index + 1}:`, winData);
                    console.log('All fields:', Object.keys(winData));
                    console.log('Media fields:');
                    console.log('  - media_url:', winData.media_url);
                    console.log('  - media_type:', winData.media_type);
                    console.log('  - media_title:', winData.media_title);
                    console.log('  - media_description:', winData.media_description);
                    console.log('  - media_format:', winData.media_format);
                    console.log('  - media_file:', winData.media_file);
                    console.log('  - media_path:', winData.media_path);
                    console.log('  - media_link:', winData.media_link);
                    console.log('  - attachment:', winData.attachment);
                    console.log('  - file_url:', winData.file_url);
                    console.log('  - image_url:', winData.image_url);
                    console.log('  - video_url:', winData.video_url);
                }
            });
            
            const winsSnapshot = { docs: winsToShow };
            
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
                
                // Coach_id is already validated in the filter above
                const coachIdString = String(winData.coach_id).trim();
                console.log('✅ Processing win with coach_id:', coachIdString);
                
                // Fetch coach details with extra safety
                try {
                    console.log('👤 Fetching coach with ID:', coachIdString);
                    const coachDoc = await db.collection('coaches').doc(coachIdString).get();
                    
                    if (!coachDoc.exists) {
                        console.log('❌ Coach not found for win:', winData.win_title, 'Coach ID:', coachIdString);
                        continue;
                    }
                    
                    const coachData = { id: coachDoc.id, ...coachDoc.data() };
                    console.log('✅ Found coach:', coachData.first_name, coachData.last_name);
                    
                    // Use actual media fields, not description
                    let mediaUrl = winData.media_url || '';
                    let mediaType = winData.media_type || '';
                    let cleanDescription = winData.win_description || '';
                    
                    console.log('🔍 Win data media fields:');
                    console.log('  - media_url:', winData.media_url);
                    console.log('  - media_type:', winData.media_type);
                    console.log('  - media_title:', winData.media_title);
                    console.log('  - media_description:', winData.media_description);
                    console.log('  - media_format:', winData.media_format);
                    
                    if (mediaUrl) {
                        console.log('📸 Found media URL:', mediaUrl);
                    } else {
                        console.log('❌ No media_url found');
                    }
                    
                    const testimonial = {
                        win: {
                            ...winData,
                            win_description: cleanDescription
                        },
                        coach: coachData,
                        media: {
                            url: mediaUrl,
                            type: mediaType,
                            title: winData.media_title || '',
                            description: winData.media_description || '',
                            format: winData.media_format || ''
                        }
                    };
                    
                    console.log('✅ Created testimonial for:', winData.win_title);
                    console.log('📎 Media URL:', mediaUrl);
                    testimonials.push(testimonial);
                    
                } catch (coachError) {
                    console.error('❌ Error fetching coach for win:', winData.win_title, 'Coach ID:', coachIdString, 'Error:', coachError.message);
                    continue;
                }
            }
            
            console.log('Total testimonials assembled:', testimonials.length);
            console.log('📊 FINAL STATS:');
            console.log('  - Total wins in database:', allWinsSnapshot.docs.length);
            console.log('  - Wins to show on wall:', winsToShow.length);
            console.log('  - Testimonials created:', testimonials.length);
            console.log('  - Wins skipped (no coach):', winsToShow.length - testimonials.length);
            
        } catch (error) {
            console.error('❌ Error fetching testimonials:', error);
            console.error('❌ Error details:', error.message);
            
            // Only return sample data for critical Firebase errors, not validation issues
            if (error.message.includes('Firebase not initialized') || 
                error.message.includes('permission') || 
                error.message.includes('network')) {
                console.log('🔄 Returning sample data due to critical Firebase error');
                return this.getSampleData();
            } else {
                console.log('🔄 Continuing with empty testimonials due to data validation issues');
                return [];
            }
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
        
        // Display actual media files
        console.log('🖼️ Creating HTML for media:', media);
        let contentHTML = '';
        if (media && media.url && media.url.trim() !== '') {
            // Display the actual media file
            contentHTML = `
                <div class="win-image" style="margin-top: 15px;">
                    <img src="${media.url}" 
                         alt="${media.title || 'Win evidence'}" 
                         style="width: 100%; max-width: 500px; border-radius: 8px; border: 1px solid #ddd;" 
                         onerror="console.error('❌ Media failed to load:', this.src)" 
                         onload="console.log('✅ Media loaded successfully:', this.src)" />
                </div>
            `;
            console.log('📸 Displaying media file:', media.url);
        } else {
            contentHTML = '<div style="margin-top: 15px; color: #666;">No media file attached</div>';
            console.log('❌ No media file to display');
        }
        
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
                    ${contentHTML}
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
