fetch('feature-overlays.json').then((response) => response.json()).then( data => {
    const Empty = { template: '' }
    const Bar = { template: `
    <div>
    <div id="markers">
      <div v-for="marker in markers" v-bind:style="markerStyle(marker)">
      </div>
    </div>
    <div class="modal fade show" tabindex="-1" role="dialog" style="display: block; pointer-events: none">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <h3>{{title}}</h3>
                <p>{{content}}</p>
              </div>

              <div class="modal-footer">
                <router-link v-bind:to="prevSlide" class="btn btn-secondary" v-if="showPrevSlide">Previous</router-link>
                <router-link v-bind:to="nextSlide" class="btn btn-primary" v-if="showNextSlide">Next</router-link>
              </div>
            </div>
          </div>
        </div>
    </div>
    `, 
        methods: {
            markerStyle: function(selector) {
                console.log(selector)
                return { border: "2px solid red" }
            }
        },
        computed: {
            currentSection: function() {
                return data.find( item => item.url == this.$route.params.section )
            },

            currentSlide: function() {
                return this.$route.params.slide - 1
            },

            content: function() {
                return this.currentSection.slides[this.currentSlide].content
            },


            markers: function() {
                return this.currentSection.slides[this.currentSlide].markers
            },

            title: function() {
                return this.currentSection.title;
            },

            showNextSlide: function() {
                if (data.indexOf(this.currentSection) < data.length - 1) {
                    return true;
                } else {
                    return this.currentSlide < this.currentSection.slides.length - 1;
                }
            },

            showPrevSlide: function() {
                if (data.indexOf(this.currentSection) > 0) {
                    return true;
                } else {
                    return this.currentSlide > 0;
                }
            },

            prevSlide: function() { 
                if (this.currentSlide == 0) {
                    const currentSectionIndex = data.indexOf(this.currentSection);
                    const prevSection = data[currentSectionIndex - 1];
                    if (prevSection) {
                        return `/${prevSection.url}/${prevSection.slides.length}`
                    } else {
                        return '';
                    }
                } else {
                    return `/${this.currentSection.url}/${this.currentSlide}`
                }
            },

            nextSlide: function() { 
                if (this.currentSection.slides.length - 1 == this.currentSlide) {
                    const currentSectionIndex = data.indexOf(this.currentSection);
                    const nextSection = data[currentSectionIndex + 1];
                    if (nextSection) {
                        return `/${nextSection.url}/1`
                    } else {
                        return '';
                    }
                } else {
                    return `/${this.currentSection.url}/${this.currentSlide + 2}`
                }
            }
    } }

    const routes = [
        { path: '/', component: {} },
        { path: '/:section/:slide', component: Bar }
    ]

    const router = new VueRouter({
        base: "/tutorial.html",
        onReady: function() {
            debugger;
        },
        routes // short for `routes: routes`
    })

    var app = new Vue({ 
        router,
        methods: {
            toggleTutorial: () => {
                if (router.currentRoute.path == '/') {
                    router.push("/performance/1")
                } else {
                    router.push("/")
                }
            }
        }
    }).$mount("#features-overlay")
})
