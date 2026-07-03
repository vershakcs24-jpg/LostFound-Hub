let items = JSON.parse(localStorage.getItem('lostFoundItems')) || [
    {
        id: 1,
        type: 'lost',
        name: 'iPhone 13 Pro',
        category: 'electronics',
        location: 'Central Park, New York',
        date: '2023-05-15',
        description: 'Black iPhone 13 Pro with blue silicone case. Lost near the fountain area.',
        contact: 'john.doe@example.com',
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop'
    },
    {
        id: 2,
        type: 'found',
        name: 'Leather Wallet',
        category: 'wallet',
        location: 'Downtown Coffee Shop',
        date: '2023-05-14',
        description: 'Brown leather wallet containing credit cards and ID. Initials "M.J." inside.',
        contact: 'coffee@example.com',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop'
    },
    {
        id: 3,
        type: 'lost',
        name: 'Gold Wedding Ring',
        category: 'jewelry',
        location: 'Main Street Gym',
        date: '2023-05-12',
        description: 'Gold wedding band with inscription "Forever Yours". Lost in locker room.',
        contact: '555-123-4567',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop'
    },
    {
        id: 4,
        type: 'found',
        name: 'Car Keys',
        category: 'keys',
        location: 'Main Street Parking Lot',
        date: '2023-05-10',
        description: 'Set of car keys with a small teddy bear keychain. Found near parking space #42.',
        contact: 'security@parking.com',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=600&fit=crop'
    }
];

// Store images temporarily
let lostItemImage = '';
let foundItemImage = '';

// DOM Elements
const reportLink = document.getElementById('reportLink');
const browseLink = document.getElementById('browseLink');
const reportModal = document.getElementById('reportModal');
const closeReportModal = document.getElementById('closeReportModal');
const itemModal = document.getElementById('itemModal');
const closeItemModal = document.getElementById('closeItemModal');
const itemsGrid = document.getElementById('itemsGrid');
const searchResults = document.getElementById('searchResults');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const noResults = document.getElementById('noResults');
const mainSearch = document.getElementById('mainSearch');
const mainSearchBtn = document.getElementById('mainSearchBtn');
const lostForm = document.getElementById('lostForm');
const foundForm = document.getElementById('foundForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderItems(items);
    
    // Set current date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('lostDate').value = today;
    document.getElementById('foundDate').value = today;

    // Setup image upload handlers
    setupImageUpload('lost');
    setupImageUpload('found');
});

// Setup image upload functionality
function setupImageUpload(type) {
    const input = document.getElementById(`${type}ImageInput`);
    const container = document.getElementById(`${type}ImageUploadContainer`);
    const preview = document.getElementById(`${type}ImagePreview`);
    const uploadContent = document.getElementById(`${type}UploadContent`);
    const changeBtn = document.getElementById(`${type}ChangeImageBtn`);

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageData = event.target.result;
                if (type === 'lost') {
                    lostItemImage = imageData;
                } else {
                    foundItemImage = imageData;
                }
                
                preview.src = imageData;
                preview.classList.add('show');
                uploadContent.style.display = 'none';
                container.classList.add('has-image');
                changeBtn.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop functionality
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        container.style.borderColor = '#27ae60';
        container.style.background = '#f0f9f4';
    });

    container.addEventListener('dragleave', function(e) {
        e.preventDefault();
        if (!container.classList.contains('has-image')) {
            container.style.borderColor = '#ddd';
            container.style.background = '#fafafa';
        }
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            input.files = e.dataTransfer.files;
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    });
}

// Change image function
function changeImage(type) {
    event.stopPropagation();
    const input = document.getElementById(`${type}ImageInput`);
    const container = document.getElementById(`${type}ImageUploadContainer`);
    const preview = document.getElementById(`${type}ImagePreview`);
    const uploadContent = document.getElementById(`${type}UploadContent`);
    const changeBtn = document.getElementById(`${type}ChangeImageBtn`);

    input.value = '';
    preview.src = '';
    preview.classList.remove('show');
    uploadContent.style.display = 'block';
    container.classList.remove('has-image');
    changeBtn.classList.remove('show');
    container.style.borderColor = '#ddd';
    container.style.background = '#fafafa';

    if (type === 'lost') {
        lostItemImage = '';
    } else {
        foundItemImage = '';
    }
}

// Render items to the grid
function renderItems(itemsToRender) {
    itemsGrid.innerHTML = '';
    searchResultsGrid.innerHTML = '';
    
    if (itemsToRender.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        itemsToRender.forEach(item => {
            const itemCard = createItemCard(item);
            if (searchResults.style.display === 'block') {
                searchResultsGrid.appendChild(itemCard);
            } else {
                itemsGrid.appendChild(itemCard);
            }
        });
    }
}

// Create an item card element
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    const statusClass = item.type === 'lost' ? 'lost' : 'found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    card.innerHTML = `
        <div class="item-image" style="background-image: url('${item.image}')"></div>
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.location} • ${formatDate(item.date)}</p>
            <span class="item-status ${statusClass}">${statusText}</span>
            <button class="view-btn">View Details</button>
        </div>
    `;
    
    card.querySelector('.view-btn').addEventListener('click', () => showItemDetails(item.id));
    return card;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show item details in modal
function showItemDetails(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const statusClass = item.type === 'lost' ? 'lost' : 'found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    document.getElementById('itemModalContent').innerHTML = `
        <h2>${item.name}</h2>
        <p><span class="item-status ${statusClass}">${statusText}</span></p>
        <div style="margin: 1.5rem 0;">
            <div style="height: 300px; background-image: url('${item.image}'); background-size: cover; background-position: center; border-radius: 8px;"></div>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <p><strong>Category:</strong> ${capitalizeFirstLetter(item.category)}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Date ${statusText}:</strong> ${formatDate(item.date)}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h4>Description</h4>
            <p>${item.description}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h4>Contact Information</h4>
            <p>${item.contact}</p>
        </div>
    `;
    
    itemModal.style.display = 'flex';
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Search functionality
function searchItems(query) {
    if (!query.trim()) {
        searchResults.style.display = 'none';
        return;
    }
    
    const results = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    renderItems(results);
    searchResults.style.display = 'block';
    document.getElementById('recentItems').style.display = 'none';
}

// Event Listeners
reportLink.addEventListener('click', (e) => {
    e.preventDefault();
    reportModal.style.display = 'flex';
});

browseLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchResults.style.display = 'none';
    document.getElementById('recentItems').style.display = 'block';
    renderItems(items);
});

closeReportModal.addEventListener('click', () => {
    reportModal.style.display = 'none';
    resetForms();
});

closeItemModal.addEventListener('click', () => {
    itemModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === reportModal) {
        reportModal.style.display = 'none';
        resetForms();
    }
    if (e.target === itemModal) {
        itemModal.style.display = 'none';
    }
});

// Reset forms function
function resetForms() {
    lostForm.reset();
    foundForm.reset();
    changeImage('lost');
    changeImage('found');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('lostDate').value = today;
    document.getElementById('foundDate').value = today;
    lostItemImage = '';
    foundItemImage = '';
}

// Tab functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
    });
});

// Search button click
mainSearchBtn.addEventListener('click', () => {
    searchItems(mainSearch.value);
});

// Search on Enter key
mainSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchItems(mainSearch.value);
    }
});

// Form submissions
lostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!lostItemImage) {
        alert('Please upload an image of the lost item');
        return;
    }
    submitItem('lost', lostItemImage);
});

foundForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!foundItemImage) {
        alert('Please upload an image of the found item');
        return;
    }
    submitItem('found', foundItemImage);
});

// Submit new item
function submitItem(type, imageData) {
    const formId = type === 'lost' ? 'lost' : 'found';
    const newItem = {
        id: Date.now(),
        type: type,
        name: document.getElementById(`${formId}ItemName`).value,
        category: document.getElementById(`${formId}Category`).value,
        location: document.getElementById(`${formId}Location`).value,
        date: document.getElementById(`${formId}Date`).value,
        description: document.getElementById(`${formId}Description`).value,
        contact: document.getElementById(`${formId}Contact`).value,
        image: imageData
    };
    
    items.unshift(newItem);
    localStorage.setItem('lostFoundItems', JSON.stringify(items));
    
    // Close modal and show success message
    reportModal.style.display = 'none';
    alert(`Your ${type} item has been reported successfully!`);
    
    // Reset forms
    resetForms();
    
    // Refresh the items list
    renderItems(items);
    searchResults.style.display = 'none';
    document.getElementById('recentItems').style.display = 'block';
}
