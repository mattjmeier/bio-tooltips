import DefaultTheme from 'vitepress/theme'
import ChemicalDemo from './components/ChemicalDemo.vue'
import ChemicalRDKitDemo from './components/ChemicalRDKitDemo.vue'
import GeneDemo from './components/GeneDemo.vue'

export default {
  // Use the Layout from the default theme
  Layout: DefaultTheme.Layout,

  enhanceApp({ app }) {
    // Register custom global components
    app.component('ChemicalDemo', ChemicalDemo);
    app.component('ChemicalRDKitDemo', ChemicalRDKitDemo);
    app.component('GeneDemo', GeneDemo);
  }
}
