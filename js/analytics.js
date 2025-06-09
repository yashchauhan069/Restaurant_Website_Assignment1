class AnalyticsManager {
    constructor() {
        this.menuData = this.loadMenuData();
        this.reviewData = this.generateSampleReviewData();
        this.charts = {};
        this.initializeAnalytics();
    }

    loadMenuData() {
        const stored = localStorage.getItem('farmaishMenu');
        return stored ? JSON.parse(stored) : this.getDefaultMenuData();
    }

    generateSampleReviewData() {
        const sampleReviews = [
            { id: 1, rating: 5, month: 'January', category: 'Salads & Bowls', comment: 'Amazing quinoa bowl!' },
            { id: 2, rating: 4, month: 'January', category: 'Main Course', comment: 'Great mushroom risotto' },
            { id: 3, rating: 5, month: 'February', category: 'Main Course', comment: 'Perfect lentil burger' },
            { id: 4, rating: 4, month: 'February', category: 'Salads & Bowls', comment: 'Fresh chickpea salad' },
            { id: 5, rating: 5, month: 'March', category: 'Desserts', comment: 'Best chia pudding ever' },
            { id: 6, rating: 3, month: 'March', category: 'Beverages', comment: 'Good smoothie selection' },
            { id: 7, rating: 5, month: 'April', category: 'Salads & Bowls', comment: 'Authentic healthy taste' },
            { id: 8, rating: 4, month: 'April', category: 'Soups', comment: 'Delicious and nutritious' },
            { id: 9, rating: 5, month: 'May', category: 'Main Course', comment: 'Exceptional plant-based quality' },
            { id: 10, rating: 4, month: 'May', category: 'Snacks & Appetizers', comment: 'Great healthy starter' },
            { id: 11, rating: 5, month: 'June', category: 'Desserts', comment: 'Perfect guilt-free ending' },
            { id: 12, rating: 5, month: 'June', category: 'Beverages', comment: 'Excellent green juice' },
            { id: 13, rating: 4, month: 'July', category: 'Salads & Bowls', comment: 'Fresh and satisfying' },
            { id: 14, rating: 5, month: 'July', category: 'Soups', comment: 'Homemade vegetable taste' },
            { id: 15, rating: 4, month: 'August', category: 'Main Course', comment: 'Perfectly seasoned' },
            { id: 16, rating: 5, month: 'August', category: 'Snacks & Appetizers', comment: 'Super fresh ingredients' },
            { id: 17, rating: 5, month: 'September', category: 'Desserts', comment: 'Amazing natural flavors' },
            { id: 18, rating: 4, month: 'September', category: 'Beverages', comment: 'Great wellness drinks' },
            { id: 19, rating: 5, month: 'October', category: 'Salads & Bowls', comment: 'Best vegetarian in town' },
            { id: 20, rating: 5, month: 'October', category: 'Main Course', comment: 'Authentic plant-based' },
            { id: 21, rating: 4, month: 'November', category: 'Main Course', comment: 'Excellent healthy presentation' },
            { id: 22, rating: 5, month: 'November', category: 'Snacks & Appetizers', comment: 'Perfect healthy portion' },
            { id: 23, rating: 5, month: 'December', category: 'Desserts', comment: 'Holiday vegan special was great' },
            { id: 24, rating: 4, month: 'December', category: 'Beverages', comment: 'Festive organic drinks' }
        ];
        return sampleReviews;
    }

    getDefaultMenuData() {
        return [
            { name: "Rainbow Quinoa Bowl", category: "Salads & Bowls", price: 16.99 },
            { name: "Creamy Mushroom Risotto", category: "Main Course", price: 19.50 },
            { name: "Mediterranean Chickpea Salad", category: "Salads & Bowls", price: 13.99 },
            { name: "Lentil Walnut Burger", category: "Main Course", price: 17.99 },
            { name: "Coconut Chia Pudding", category: "Desserts", price: 8.99 },
            { name: "Green Goddess Smoothie", category: "Beverages", price: 7.50 }
        ];
    }

    initializeAnalytics() {
        this.createCharts();
    }

    createCharts() {
        this.createCategoryChart();
        this.createRatingChart();
    }

    createCategoryChart() {
        const categoryData = this.getCategoryDistribution();
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        this.charts.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
                        '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} items (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createRatingChart() {
        const ratingData = this.getRatingDistribution();
        const ctx = document.getElementById('ratingChart').getContext('2d');
        
        this.charts.ratingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Number of Reviews',
                    data: [
                        ratingData[1] || 0,
                        ratingData[2] || 0,
                        ratingData[3] || 0,
                        ratingData[4] || 0,
                        ratingData[5] || 0
                    ],
                    backgroundColor: ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#27ae60'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Reviews'
                        }
                    }
                }
            }
        });
    }

    getCategoryDistribution() {
        const distribution = {};
        this.menuData.forEach(item => {
            distribution[item.category] = (distribution[item.category] || 0) + 1;
        });
        return distribution;
    }

    getRatingDistribution() {
        const distribution = {};
        this.reviewData.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        });
        return distribution;
    }
}

let analyticsManager;
document.addEventListener('DOMContentLoaded', function() {
    analyticsManager = new AnalyticsManager();
}); 