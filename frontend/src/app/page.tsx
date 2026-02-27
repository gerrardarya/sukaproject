import { MessageCircle, Instagram } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-muted/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="font-serif text-xl font-medium">Premium Gifting</div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#philosophy" className="hover:text-accent transition-colors">Philosophy</a>
              <a href="#process" className="hover:text-accent transition-colors">Process</a>
              <a href="#services" className="hover:text-accent transition-colors">Services</a>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-foreground">
                  Gifting is more than giving things — it's creating art.
                </h1>
                <p className="text-lg md:text-xl text-muted leading-relaxed max-w-lg">
                  Every gift tells a story. We craft personalized experiences that connect hearts and create lasting memories.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/1234567890"
                  className="bg-accent text-background px-8 py-4 rounded-lg font-medium hover:bg-accent/90 transition-colors text-center"
                >
                  Consult via WhatsApp
                </a>
                <a
                  href="#services"
                  className="border border-foreground/20 px-8 py-4 rounded-lg font-medium hover:bg-foreground/5 transition-colors text-center"
                >
                  View Our Creations
                </a>
              </div>
            </div>
            <div className="bg-cream rounded-2xl h-96 lg:h-[500px] flex items-center justify-center">
              <div className="text-muted text-center">
                <div className="w-24 h-24 bg-muted/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <p className="text-sm">Hero Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section id="philosophy" className="py-20 px-6 bg-cream/50">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Our Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-foreground">Story</h3>
                <p className="text-muted leading-relaxed">
                  Every gift begins with understanding your unique story. We listen deeply to craft experiences that resonate with your authentic self.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-foreground">Care</h3>
                <p className="text-muted leading-relaxed">
                  Attention to every detail, from sourcing premium materials to ensuring perfect presentation. Quality is our quiet promise.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-foreground">Heart</h3>
                <p className="text-muted leading-relaxed">
                  We believe in the power of thoughtful giving. Each creation is made with intention, designed to touch hearts and create joy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Way of Creating */}
      <section id="process" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Our Way of Creating</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              A thoughtful process that transforms stories into beautiful, meaningful gifts.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Stories", desc: "We begin by listening to your story" },
              { step: "02", title: "Curation", desc: "Carefully selecting premium materials" },
              { step: "03", title: "Design", desc: "Crafting with intention and beauty" },
              { step: "04", title: "Execution", desc: "Meticulous attention to detail" },
              { step: "05", title: "Delivery", desc: "Timely, elegant presentation" }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4 group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
                  <span className="font-serif text-accent font-medium">{item.step}</span>
                </div>
                <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section id="services" className="py-20 px-6 bg-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">What We Do</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Curated experiences for every occasion, crafted with premium attention to detail.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Signature Hampers",
                desc: "Luxurious, personalized gift baskets combining premium items with thoughtful curation.",
                icon: "🎁"
              },
              {
                title: "Baby Hampers",
                desc: "Gentle, beautiful gifts celebrating new beginnings with soft, high-quality essentials.",
                icon: "👶"
              },
              {
                title: "Corporate Merchandise",
                desc: "Professional, branded gifts that reflect your company's values and culture.",
                icon: "🏢"
              }
            ].map((service, index) => (
              <div key={index} className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="font-serif text-xl text-foreground mb-4">{service.title}</h3>
                <p className="text-muted leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { title: "Signature Art", desc: "Every creation is a unique work of art" },
              { title: "Well Made", desc: "Premium materials, exceptional craftsmanship" },
              { title: "Reliably Delivered", desc: "Timely, elegant, and perfectly presented" }
            ].map((value, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-serif text-xl text-foreground">{value.title}</h3>
                <p className="text-muted">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section id="contact" className="py-20 px-6 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              Tell us your story. We'll create the art.
            </h2>
            <p className="text-muted text-lg">
              Let's discuss your vision and craft something truly special together.
            </p>
          </div>
          <a
            href="https://wa.me/1234567890"
            className="inline-flex items-center gap-3 bg-accent text-background px-12 py-6 rounded-lg font-medium hover:bg-accent/90 transition-colors text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-serif text-xl font-medium">Premium Gifting</div>
            <div className="flex items-center gap-6">
              <a
                href="https://wa.me/1234567890"
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
          <div className="text-center text-muted text-sm mt-8 pt-8 border-t border-muted/20">
            © 2024 Premium Gifting. Creating art through thoughtful giving.
          </div>
        </div>
      </footer>
    </div>
  );
}
