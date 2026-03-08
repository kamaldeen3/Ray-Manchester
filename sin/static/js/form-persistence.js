// Form Data Persistence - Auto-save and restore form inputs
document.addEventListener('DOMContentLoaded', function() {
    const formStoragePrefix = 'form_data_';
    const excludedInputTypes = ['password', 'submit', 'button', 'reset', 'file'];
    const excludedFieldNames = ['csrfmiddlewaretoken'];
    
    // Get unique key for current page
    function getPageStorageKey() {
        return formStoragePrefix + window.location.pathname;
    }
    
    // Load saved form data
    function restoreSavedFormData() {
        const storageKey = getPageStorageKey();
        const serializedData = localStorage.getItem(storageKey);
        
        if (serializedData) {
            try {
                const savedFields = JSON.parse(serializedData);
                
                // Restore each saved field
                Object.keys(savedFields).forEach(fieldName => {
                    const formField = document.querySelector(`[name="${fieldName}"]`);
                    
                    if (formField) {
                        if (formField.tagName === 'SELECT') {
                            formField.value = savedFields[fieldName];
                        } else if (formField.type === 'checkbox') {
                            formField.checked = savedFields[fieldName];
                        } else if (formField.type === 'radio') {
                            if (formField.value === savedFields[fieldName]) {
                                formField.checked = true;
                            }
                        } else {
                            formField.value = savedFields[fieldName];
                        }
                    }
                });
                
                console.log('Form data restored from previous session');
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        }
    }
    
    // Save form data
    function persistFormData() {
        const storageKey = getPageStorageKey();
        const fieldsToSave = {};
        
        // Find all input fields on the page
        const formFields = document.querySelectorAll('input, select, textarea');
        
        formFields.forEach(formField => {
            // Skip excluded fields
            if (excludedInputTypes.includes(formField.type) || 
                excludedFieldNames.includes(formField.name) || 
                !formField.name) {
                return;
            }
            
            // Save field value
            if (formField.type === 'checkbox') {
                fieldsToSave[formField.name] = formField.checked;
            } else if (formField.type === 'radio') {
                if (formField.checked) {
                    fieldsToSave[formField.name] = formField.value;
                }
            } else {
                fieldsToSave[formField.name] = formField.value;
            }
        });
        
        // Only save if there's data
        if (Object.keys(fieldsToSave).length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(fieldsToSave));
        }
    }
    
    // Clear saved form data for current page
    function clearSavedFormData() {
        const storageKey = getPageStorageKey();
        localStorage.removeItem(storageKey);
        console.log('Form data cleared');
    }
    
    // Attach listeners to all form fields
    function bindFormPersistenceListeners() {
        const formFields = document.querySelectorAll('input, select, textarea');
        
        formFields.forEach(formField => {
            // Skip password and excluded fields
            if (excludedInputTypes.includes(formField.type) || 
                excludedFieldNames.includes(formField.name)) {
                return;
            }
            
            // Save on input change
            formField.addEventListener('input', persistFormData);
            formField.addEventListener('change', persistFormData);
        });
        
        // Clear data on successful form submission
        const allForms = document.querySelectorAll('form');
        allForms.forEach(currentForm => {
            currentForm.addEventListener('submit', function(_event) {
                // Only clear if it's not a GET request (search forms)
                if (currentForm.method.toLowerCase() !== 'get') {
                    // Delay clearing to allow form submission
                    setTimeout(clearSavedFormData, 100);
                }
            });
        });
    }
    
    // Add clear button functionality (optional)
    function addSearchClearButtons() {
        const allForms = document.querySelectorAll('form');
        
        allForms.forEach(currentForm => {
            // Only add to forms that aren't POST forms (like search)
            if (currentForm.method.toLowerCase() === 'get') {
                const clearButton = document.createElement('button');
                clearButton.type = 'button';
                clearButton.className = 'clear-form-btn';
                clearButton.textContent = '✕';
                clearButton.title = 'Clear search';
                clearButton.style.cssText = 'margin-left:0.5rem;padding:0.5rem 0.75rem;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;';
                
                clearButton.addEventListener('click', function() {
                    // Clear form fields
                    currentForm.reset();
                    // Save the cleared state
                    persistFormData();
                    // Show feedback
                    showToast('Search cleared', 'info');
                });
                
                // Append to form
                if (currentForm.classList.contains('filters')) {
                    currentForm.appendChild(clearButton);
                }
            }
        });
    }
    
    // Show notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `form-notification ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
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
            toast.style.background = '#ecfdf5';
            toast.style.color = '#065f46';
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // Initialize
    restoreSavedFormData();
    bindFormPersistenceListeners();
    addSearchClearButtons();
    
    // Debug: Add clear all button (optional - for development)
    // console.log('Form persistence enabled. Current page data:', localStorage.getItem(getPageStorageKey()));
});
