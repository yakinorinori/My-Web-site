/**
 * ユーザー設定管理モジュール
 * CSV設定、フィルター、その他のユーザー設定を管理
 */

// グローバル設定オブジェクト
let userSettings = {
    username: 'Guest',
    csvSource: './sales.csv',
    filters: {},
    updatedAt: new Date().toISOString()
};

/**
 * ユーザー設定を保存（サーバーに送信）
 */
async function saveUserSettings() {
    console.log('💾 ユーザー設定を保存中...', userSettings);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/user-settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                csvSource: userSettings.csvSource,
                filters: userSettings.filters
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '設定の保存に失敗しました');
        }
        
        const data = await response.json();
        console.log('✅ 設定を保存しました:', data.settings);
        
        // 成功メッセージを表示
        showNotification('✅ 設定を保存しました', 'success');
        return true;
    } catch (error) {
        console.error('❌ 設定保存エラー:', error);
        showNotification(`❌ エラー: ${error.message}`, 'error');
        return false;
    }
}

/**
 * ユーザー設定を読み込む（サーバーから取得）
 */
async function loadUserSettings() {
    console.log('📖 ユーザー設定を読み込み中...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/user-settings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.warn('⚠️  設定読み込みエラー:', error.error);
            return false;
        }
        
        const data = await response.json();
        if (data.success && data.settings) {
            userSettings = {
                username: data.settings.username || 'Guest',
                csvSource: data.settings.csvSource || './sales.csv',
                filters: data.settings.filters || {},
                updatedAt: data.settings.updatedAt || new Date().toISOString()
            };
            console.log('✅ 設定を読み込みました:', userSettings);
            applySettings();
            return true;
        }
    } catch (error) {
        console.error('❌ 設定読み込みエラー:', error);
        return false;
    }
}

/**
 * ユーザー設定を削除
 */
async function deleteUserSettings() {
    if (!confirm('本当に設定を削除してもよろしいですか？\n（デフォルト設定にリセットされます）')) {
        return false;
    }
    
    console.log('🗑️  ユーザー設定を削除中...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/user-settings`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '設定の削除に失敗しました');
        }
        
        // デフォルト設定にリセット
        userSettings = {
            username: userSettings.username,
            csvSource: './sales.csv',
            filters: {},
            updatedAt: new Date().toISOString()
        };
        
        console.log('✅ 設定を削除しました');
        showNotification('✅ 設定をリセットしました', 'success');
        applySettings();
        return true;
    } catch (error) {
        console.error('❌ 設定削除エラー:', error);
        showNotification(`❌ エラー: ${error.message}`, 'error');
        return false;
    }
}

/**
 * 読み込んだ設定をUIに反映
 */
function applySettings() {
    console.log('⚙️  設定をUIに反映中...', userSettings);
    
    // CSV設定をUIに反映
    const csvSourceInput = document.getElementById('csv-source-input');
    if (csvSourceInput) {
        csvSourceInput.value = userSettings.csvSource;
    }
    
    // フィルター設定をUIに反映（必要に応じて追加）
    const filtersJson = document.getElementById('filters-json');
    if (filtersJson) {
        filtersJson.value = JSON.stringify(userSettings.filters, null, 2);
    }
    
    console.log('✅ UIに設定を反映しました');
}

/**
 * UI設定をuserSettingsオブジェクトに反映
 */
function captureSettingsFromUI() {
    console.log('📋 UIから設定をキャプチャ中...');
    
    const csvSourceInput = document.getElementById('csv-source-input');
    if (csvSourceInput) {
        userSettings.csvSource = csvSourceInput.value || './sales.csv';
    }
    
    const filtersJson = document.getElementById('filters-json');
    if (filtersJson) {
        try {
            userSettings.filters = JSON.parse(filtersJson.value || '{}');
        } catch (e) {
            console.warn('⚠️  フィルター JSON のパースエラー:', e);
            userSettings.filters = {};
        }
    }
    
    userSettings.updatedAt = new Date().toISOString();
    console.log('✅ UIから設定をキャプチャしました:', userSettings);
}

/**
 * 設定パネルの表示/非表示を切り替え
 */
function toggleSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    if (panel) {
        panel.classList.toggle('active');
        console.log('🔧 設定パネルを切り替えました:', panel.classList.contains('active'));
    }
}

/**
 * 設定パネルのHTMLを作成
 */
function createSettingsPanelHTML() {
    return `
        <div id="settings-panel" class="settings-panel">
            <h3>⚙️ CSV設定</h3>
            
            <div class="settings-group">
                <label for="csv-source-input">CSVソース:</label>
                <input 
                    type="text" 
                    id="csv-source-input" 
                    placeholder="./sales.csv"
                    value="./sales.csv"
                >
            </div>
            
            <div class="settings-group">
                <label for="filters-json">フィルター (JSON):</label>
                <textarea 
                    id="filters-json" 
                    rows="4"
                    placeholder="{}"
                    style="font-family: 'SF Mono', Monaco, monospace; font-size: 0.9em;"
                >{}</textarea>
            </div>
            
            <div class="settings-buttons">
                <button 
                    class="settings-btn settings-btn-save"
                    onclick="captureSettingsFromUI(); saveUserSettings();"
                >
                    💾 保存
                </button>
                <button 
                    class="settings-btn settings-btn-reset"
                    onclick="deleteUserSettings();"
                >
                    🔄 リセット
                </button>
                <button 
                    class="settings-btn settings-btn-reset"
                    onclick="toggleSettingsPanel();"
                >
                    ✕ 閉じる
                </button>
            </div>
        </div>
        
        <button 
            id="settings-toggle-btn"
            class="settings-btn-toggle"
            onclick="toggleSettingsPanel();"
            title="設定を開く"
        >
            ⚙️
        </button>
    `;
}

/**
 * 通知メッセージを表示
 */
function showNotification(message, type = 'info') {
    console.log(`📢 通知 [${type}]:`, message);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 90vw;
        animation: slideIn 0.3s ease;
        font-size: 0.95em;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒後に削除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * 初期化
 */
function initSettings() {
    console.log('🔧 設定システムを初期化中...');
    
    // スタイル追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ 設定システムを初期化しました');
}

// ページ読み込み時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}
