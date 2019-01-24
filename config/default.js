module.exports = {
  versioning: true,
  // pass locale, only to migrate entries from that locale
  // not passing `locale` will migrate all the locales present
  // locales: ['fr-fr'],
  host: 'https://api.contentstack.io/v3',
  modules: {
    types: [
      'assets',
      'locales',
      'environments',
      'content_types',
      'entries'
    ],
    locales: {
      dirName: 'locales',
      fileName: 'locales.json',
      requiredKeys: [
        'code',
        'uid',
        'name'
      ]
    },
    environments: {
      dirName: 'environments',
      fileName: 'environments.json'
    },
    assets: {
      dirName: 'assets',
      fileName: 'assets.json',
      // This is the total no. of asset objects fetched in each 'get assets' call
      limit: 100,
      host: 'https://api.contentstack.io',
      validKeys: [
        'uid',
        'filename',
        'url',
        'status'
      ],
      assetBatchLimit: 5
    },
    content_types: {
      dirName: 'content_types',
      fileName: 'content_types.json',
      validKeys: [
        'title',
        'uid',
        'schema',
        'options',
        'singleton',
        'description'
      ],
      limit: 100
    },
    entries: {
      dirName: 'entries',
      fileName: 'entries.json',
      invalidKeys: [
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        '_metadata',
        'published'
      ],
      limit: 50
    }
  },
  apis: {
    userSession: '/user-session/',
    locales: '/locales/',
    environments: '/environments/',
    assets: '/assets/',
    content_types: '/content_types/',
    entries: '/entries/',
    folders: '/folders/'
  }
  // if exisstingContentDir exists, no backup folder will be created
  // rather, its value(path) will be used instead
  // useBackedupDir: './_backup_694',
  // is the no. of files to be copied/backed up concurrently
  // backupConcurrency: 10,
};