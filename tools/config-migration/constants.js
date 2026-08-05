/** HTTP-related keys that moved from server → http in v2.0.0 */
export const SERVER_HTTP_KEYS = [
  'port',
  'listen',
  'baseURL',
  'socket',
  'tlsKey',
  'tlsCert',
  'externalUrl',
  'internalUrl',
  'disableWebDAV',
  'disableRateLimit',
];

/** Global permission keys that stay under userDefaults.account.permissions */
export const GLOBAL_PERMISSION_KEYS = ['admin', 'api', 'share', 'realtime'];

/** File permission keys migrated to server.sources[].config.defaultPermissions */
export const FILE_PERMISSION_KEYS = ['view', 'modify', 'create', 'delete', 'download'];

/** Flat v1 userDefaults top-level keys → v2 dot paths (mirrors user_enforcement_fields.go) */
export const FLAT_USER_DEFAULTS_MAP = {
  disableQuickToggles: 'sidebar.disableQuickToggles',
  hideSidebarFileActions: 'sidebar.hideFileActions',
  stickySidebar: 'sidebar.sticky',
  hideFilesInTree: 'sidebar.hideFiles',
  showToolsInSidebar: 'sidebar.showTools',
  deleteWithoutConfirming: 'listing.deleteWithoutConfirming',
  dateFormat: 'listing.dateFormat',
  showHidden: 'listing.showHidden',
  quickDownload: 'listing.quickDownload',
  showSelectMultiple: 'listing.showSelectMultiple',
  singleClick: 'listing.singleClick',
  hideFileExt: 'listing.hideFileExt',
  showCopyPath: 'listing.showCopyPath',
  deleteAfterArchive: 'listing.deleteAfterArchive',
  viewMode: 'listing.viewMode',
  gallerySize: 'listing.gallerySize',
  disablePreviewExt: 'preview.disablePreviewExt',
  disableSearchOptions: 'search.disableOptions',
  editorQuickSave: 'fileViewer.editorQuickSave',
  preferEditorForMarkdown: 'fileViewer.preferEditorForMarkdown',
  debugOffice: 'fileViewer.debugOffice',
  disableViewingExt: 'fileViewer.disableViewingExt',
  disableOnlyOfficeExt: 'fileViewer.disableOnlyOfficeExt',
  disableOfficePreviewExt: 'fileViewer.disableOnlyOfficeExt',
  darkMode: 'ui.darkMode',
  themeColor: 'ui.themeColor',
  customTheme: 'ui.customTheme',
  locale: 'ui.locale',
  lockPassword: 'account.lockPassword',
  disableSettings: 'account.disableSettings',
  disableUpdateNotifications: 'account.disableUpdateNotifications',
  loginMethod: 'account.loginMethod',
};

/** preview.* subfields that may appear flat or under preview object */
export const PREVIEW_SUBFIELD_MAP = {
  image: 'preview.image',
  video: 'preview.video',
  audio: 'preview.audio',
  motionVideoPreview: 'preview.motionVideoPreview',
  office: 'preview.office',
  popup: 'preview.popup',
  folder: 'preview.folder',
  models: 'preview.models',
  autoplayMedia: 'fileViewer.autoplayMedia',
  defaultMediaPlayer: 'fileViewer.defaultMediaPlayer',
  disableHideSidebar: 'sidebar.disableHideOnPreview',
};

export const FILE_LOADING_KEYS = [
  'maxConcurrentUpload',
  'uploadChunkSizeMb',
  'downloadChunkSizeMb',
  'clearAll',
];

/** Top-level keys removed from integrations or sources in v2 */
export const REMOVED_INTEGRATION_KEYS = ['exiftoolPath'];

export const DEPRECATED_SOURCE_CONFIG_KEYS = ['indexingIntervalMinutes', 'conditionals', 'hidden'];

export const DEPRECATED_RULE_KEYS = ['fileNames', 'folderNames', 'hidden'];

/** Not valid in v2 indexing rules (access rules are stored separately). */
export const REMOVED_RULE_KEYS = ['regex', 'allow'];

/** conditionals.* wrapper flags promoted to a global rule when present. */
export const CONDITIONALS_GLOBAL_KEYS = [
  'hidden',
  'ignoreHidden',
  'ignoreZeroSizeFolders',
  'ignoreSymlinks',
];

export const VALID_TOP_LEVEL_KEYS = new Set([
  'server',
  'http',
  'auth',
  'frontend',
  'userDefaults',
  'integrations',
]);
