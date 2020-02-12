const path = require('path')

const isPlainObject = require('lodash/isPlainObject')
const extend = require('lodash/extend')

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/sass/global.sass'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {

      /**
       * custom configuration for store/constants.yaml
       */
      const yaml = require('js-yaml')
      const actionSufixes = ['STARTED', 'COMPLETED', 'SUCCESSFUL', 'FAILED']

      config.module.rules.push({
        test: /\.yaml$/,
        include: path.resolve(__dirname, 'store/constants'),
        use: [{
          loader: 'skeleton-loader',
          options: {
            procedure: function (content) {
              let parsed = yaml.safeLoad(content)
              let obj = {}
              let actions = parsed.ACTION ? parsed.ACTION : []
              let generics = parsed.ACTION ? (parsed.GENERIC ? parsed.GENERIC : []) : parsed

              for (var i = 0; i < actions.length; i++) {
                obj[actions[i]] = actions[i]
                for (var j = 0; j < actionSufixes.length; j++) {
                  let type = actions[i] + '_' + actionSufixes[j]
                  obj[type] = type
                }
              }

              for (i = 0; i < generics.length; i++) {
                if (isPlainObject(generics[i])) {
                  extend(obj, generics[i])
                } else {
                  obj[generics[i]] = generics[i]
                }
              }

              return obj
            },
            toCode: true
          }
        }]
      })

      /**
       * configuration for other yaml files
       */
      config.module.rules.push({
        test: /\.yaml$/,
        exclude: path.resolve(__dirname, 'store/constants'),
        use: [{
          loader: 'skeleton-loader',
          options: {
            procedure: function (content) {
              return yaml.load(content)
            },
            toCode: true
          }
        }]
      })
    }
  }
}
