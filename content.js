function log(message) {
    console.log(`[ChatGPT Folder Extension] ${message}`);
}

// Locate the sidebar (works for current ChatGPT layout - can adjust if layout changes)
function getSidebarElement() {
    const nav = document.querySelector('nav');
    if (nav) return nav;

    // Backup if OpenAI changes the layout
    return document.querySelector('aside');
}

// Check if we've already injected the folder UI (avoid duplicates)
function folderManagerExists() {
    return !!document.getElementById('chatgpt-folder-manager');
}

// Inject folder manager into the sidebar
function injectFolderUI() {
    const sidebar = getSidebarElement();
    if (!sidebar) {
        log('Sidebar not found, retrying in 1 second...');
        setTimeout(injectFolderUI, 1000);
        return;
    }

    if (folderManagerExists()) {
        log('Folder manager already exists — skipping injection.');
        return;
    }

    const folderSection = document.createElement('div');
    folderSection.id = 'chatgpt-folder-manager';
    folderSection.style.padding = '10px';
    folderSection.style.borderBottom = '1px solid #ccc';
    folderSection.style.marginBottom = '10px';
    folderSection.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">📂 Chat Folders</div>
        <div id="folder-list"></div>
        <button id="create-folder-btn" style="padding: 5px 10px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 5px;">➕ Create Folder</button>
    `;

    sidebar.prepend(folderSection);

    document.getElementById('create-folder-btn').addEventListener('click', () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            addFolder(folderName);
        }
    });

    log('Folder UI injected successfully.');
}

// Add folder to list (temporary, will add persistence later)
function addFolder(name) {
    const folderList = document.getElementById('folder-list');
    const folderItem = document.createElement('div');
    folderItem.textContent = `📂 ${name}`;
    folderItem.style.padding = '5px 0';
    folderItem.style.cursor = 'pointer';

    folderItem.addEventListener('click', () => {
        alert(`Open folder: ${name}`);
    });

    folderList.appendChild(folderItem);
}

// Observe sidebar for dynamic refresh (ChatGPT sometimes refreshes sections)
const observer = new MutationObserver(() => {
    if (!folderManagerExists()) {
        injectFolderUI();
    }
});

// Inject once at startup and set observer
injectFolderUI();
observer.observe(document.body, { childList: true, subtree: true });

log('ChatGPT Folder Manager content script initialized.');
