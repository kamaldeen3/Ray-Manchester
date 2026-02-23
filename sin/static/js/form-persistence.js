// Form Data Persistence - Auto-save and restore form inputs
document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_PREFIX = 'form_data_';
    const EXCLUDE_TYPES = ['password', 'submit', 'button', 'reset', 'file'];
    const EXCLUDE_NAMES = ['csrfmiddlewaretoken'];
    
    // Get unique key for current page
    function getPageKey() {
        return STORAGE_PREFIX + window.location.pathname;
    }
    
    // Load saved form data
    function loadFormData() {
        const pageKey = getPageKey();
        const savedData = localStorage.getItem(pageKey);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Restore each saved field
                Object.keys(data).forEach(fieldName => {
                    const field = document.querySelector(`[name="${fieldName}"]`);
                    
                    if (field) {
                        if (field.tagName === 'SELECT') {
                            field.value = data[fieldName];
                        } else if (field.type === 'checkbox') {
                            field.checked = data[fieldName];
                        } else if (field.type === 'radio') {
                            if (field.value === data[fieldName]) {
                                field.checked = true;
                            }
                        } else {
                            field.value = data[fieldName];
                        }
                    }
                });
                
                console.log('Form data restored from previous session');
            } catch (e) {
                console.error('Error loading form data:', e);
            }
        }
    }
    
    // Save form data
    function saveFormData() {
        const pageKey = getPageKey();
        const formData = {};
        
        // Find all input fields on the page
        const fields = document.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Skip excluded fields
            if (EXCLUDE_TYPES.includes(field.type) || 
                EXCLUDE_NAMES.includes(field.name) || 
                !field.name) {
                return;
            }
            
            // Save field value
            if (field.type === 'checkbox') {
                formData[field.name] = field.checked;
            } else if (field.type === 'radio') {
                if (field.checked) {
                    formData[field.name] = field.value;
                }
            } else {
                formData[field.name] = field.value;
            }
        });
        
        // Only save if there's data
        if (Object.keys(formData).length > 0) {
            localStorage.setItem(pageKey, JSON.stringify(formData));
        }
    }
    
    // Clear saved form data for current page
    function clearFormData() {
        const pageKey = getPageKey();
        localStorage.removeItem(pageKey);
        console.log('Form data cleared');
    }
    
    // Attach listeners to all form fields
    function attachListeners() {
        const fields = document.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Skip password and excluded fields
            if (EXCLUDE_TYPES.includes(field.type) || 
                EXCLUDE_NAMES.includes(field.name)) {
                return;
            }
            
            // Save on input change
            field.addEventListener('input', saveFormData);
            field.addEventListener('change', saveFormData);
        });
        
        // Clear data on successful form submission
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // Only clear if it's not a GET request (search forms)
                if (form.method.toLowerCase() !== 'get') {
                    // Delay clearing to allow form submission
                    setTimeout(clearFormData, 100);
                }
            });
        });
    }
    
    // Add clear button functionality (optional)
    function addClearButtons() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Only add to forms that aren't POST forms (like search)
            if (form.method.toLowerCase() === 'get') {
                const clearBtn = document.createElement('button');
                clearBtn.type = 'button';
                clearBtn.className = 'clear-form-btn';
                clearBtn.textContent = '✕';
                clearBtn.title = 'Clear search';
                clearBtn.style.cssText = 'margin-left:0.5rem;padding:0.5rem 0.75rem;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;';
                
                clearBtn.addEventListener('click', function() {
                    // Clear form fields
                    form.reset();
                    // Save the cleared state
                    saveFormData();
                    // Show feedback
                    showNotification('Search cleared', 'info');
                });
                
                // Append to form
                if (form.classList.contains('filters')) {
                    form.appendChild(clearBtn);
                }
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            background: #eff6ff;
            color: #1e40af;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-size: 0.9rem;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = '#ecfdf5';
            notification.style.color = '#065f46';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Initialize
    loadFormData();
    attachListeners();
    addClearButtons();
    
    // Debug: Add clear all button (optional - for development)
    // console.log('Form persistence enabled. Current page data:', localStorage.getItem(getPageKey()));
});
