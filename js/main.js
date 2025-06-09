class MenuManager {
    constructor() {
        this.menuItems = this.loadMenuItems();
        this.currentEditId = null;
        this.initializeEventListeners();
        this.initializeWithSampleData();
        this.displayMenuItems();
    }

    initializeEventListeners() {
        document.getElementById('menuForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.cancelEdit());
    }

    initializeWithSampleData() {
        if (this.menuItems.length === 0) {
            const sampleData = [
                {
                    id: this.generateId(),
                    name: "Rainbow Quinoa Bowl",
                    category: "Salads & Bowls",
                    price: 16.99,
                    description: "Colorful quinoa bowl with roasted vegetables, avocado, and tahini dressing",
                    availability: "Available"
                },
                {
                    id: this.generateId(),
                    name: "Creamy Mushroom Risotto",
                    category: "Main Course",
                    price: 19.50,
                    description: "Arborio rice cooked with wild mushrooms, vegetable stock, and nutritional yeast",
                    availability: "Available"
                },
                {
                    id: this.generateId(),
                    name: "Mediterranean Chickpea Salad",
                    category: "Salads & Bowls",
                    price: 13.99,
                    description: "Fresh chickpeas with cucumbers, tomatoes, olives, and herb vinaigrette",
                    availability: "Available"
                },
                {
                    id: this.generateId(),
                    name: "Lentil Walnut Burger",
                    category: "Main Course",
                    price: 17.99,
                    description: "House-made patty with red lentils, walnuts, and herbs, served with sweet potato fries",
                    availability: "Limited"
                },
                {
                    id: this.generateId(),
                    name: "Coconut Chia Pudding",
                    category: "Desserts",
                    price: 8.99,
                    description: "Creamy chia pudding with coconut milk, fresh berries, and maple syrup",
                    availability: "Available"
                },
                {
                    id: this.generateId(),
                    name: "Green Goddess Smoothie",
                    category: "Beverages",
                    price: 7.50,
                    description: "Spinach, mango, banana, coconut water, and spirulina superfood blend",
                    availability: "Available"
                }
            ];
            this.menuItems = sampleData;
            this.saveMenuItems();
        }
    }

    generateId() {
        return 'menu_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadMenuItems() {
        const stored = localStorage.getItem('farmaishMenu');
        return stored ? JSON.parse(stored) : [];
    }

    saveMenuItems() {
        localStorage.setItem('farmaishMenu', JSON.stringify(this.menuItems));
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const menuItem = {
            name: formData.get('itemName').trim(),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            description: formData.get('description').trim(),
            availability: formData.get('availability')
        };
        if (!this.validateMenuItem(menuItem)) {
            return;
        }

        if (this.currentEditId) {
            this.updateMenuItem(this.currentEditId, menuItem);
        } else {
            menuItem.id = this.generateId();
            this.createMenuItem(menuItem);
        }

        this.resetForm();
        this.displayMenuItems();
        this.applyFilters();
    }

    validateMenuItem(item) {
        if (!item.name || item.name.length < 2) {
            alert('Item name must be at least 2 characters long.');
            return false;
        }
        
        if (!item.category) {
            alert('Please select a category.');
            return false;
        }
        
        if (isNaN(item.price) || item.price <= 0) {
            alert('Please enter a valid price greater than 0.');
            return false;
        }
        
        if (!item.description || item.description.length < 10) {
            alert('Description must be at least 10 characters long.');
            return false;
        }
        
        const existingItem = this.menuItems.find(existing => 
            existing.name.toLowerCase() === item.name.toLowerCase() && 
            existing.id !== this.currentEditId
        );
        
        if (existingItem) {
            alert('An item with this name already exists.');
            return false;
        }
        
        return true;
    }

    createMenuItem(item) {
        this.menuItems.push(item);
        this.saveMenuItems();
        this.showMessage('Menu item added successfully!', 'success');
    }

    updateMenuItem(id, updatedItem) {
        const index = this.menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
            this.menuItems[index] = { ...updatedItem, id };
            this.saveMenuItems();
            this.showMessage('Menu item updated successfully!', 'success');
        }
    }

    deleteMenuItem(id) {
        if (confirm('Are you sure you want to delete this menu item?')) {
            this.menuItems = this.menuItems.filter(item => item.id !== id);
            this.saveMenuItems();
            this.displayMenuItems();
            this.applyFilters();
            this.showMessage('Menu item deleted successfully!', 'success');
        }
    }

    editMenuItem(id) {
        const item = this.menuItems.find(item => item.id === id);
        if (item) {
            document.getElementById('itemName').value = item.name;
            document.getElementById('category').value = item.category;
            document.getElementById('price').value = item.price;
            document.getElementById('description').value = item.description;
            document.getElementById('availability').value = item.availability;
            
            this.currentEditId = id;
            document.getElementById('submitBtn').textContent = 'Update Menu Item';
            document.getElementById('cancelBtn').style.display = 'inline-block';
            
            document.getElementById('menuForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    resetForm() {
        document.getElementById('menuForm').reset();
        this.currentEditId = null;
        document.getElementById('submitBtn').textContent = 'Add Menu Item';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    displayMenuItems(items = this.menuItems) {
        const tbody = document.getElementById('menuTableBody');
        const noItemsMessage = document.getElementById('noItemsMessage');
        
        if (items.length === 0) {
            tbody.innerHTML = '';
            noItemsMessage.style.display = 'block';
            return;
        }
        
        noItemsMessage.style.display = 'none';
        
        tbody.innerHTML = items.map(item => `
            <tr>
                <td><strong>${this.escapeHtml(item.name)}</strong></td>
                <td><span style="background: #e74c3c; color: white; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.8rem;">${item.category}</span></td>
                <td><strong>$${item.price.toFixed(2)}</strong></td>
                <td>${this.escapeHtml(item.description)}</td>
                <td>
                    <span style="background: ${this.getAvailabilityColor(item.availability)}; color: white; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.8rem;">
                        ${item.availability}
                    </span>
                </td>
                <td>
                    <button onclick="menuManager.editMenuItem('${item.id}')" class="btn btn-secondary" style="margin-right: 0.5rem; padding: 0.5rem 1rem;">
                        Edit
                    </button>
                    <button onclick="menuManager.deleteMenuItem('${item.id}')" class="btn btn-danger" style="padding: 0.5rem 1rem;">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getAvailabilityColor(availability) {
        switch (availability) {
            case 'Available': return '#27ae60';
            case 'Limited': return '#f39c12';
            case 'Sold Out': return '#e74c3c';
            default: return '#95a5a6';
        }
    }

    showMessage(message, type = 'info') {
        alert(message);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    exportMenuData() {
        const dataStr = JSON.stringify(this.menuItems, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bella-vista-menu.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all menu data? This cannot be undone.')) {
            this.menuItems = [];
            this.saveMenuItems();
            this.displayMenuItems();
            this.showMessage('All menu data cleared successfully!', 'success');
        }
    }
}

let menuManager;
document.addEventListener('DOMContentLoaded', function() {
    menuManager = new MenuManager();
}); 