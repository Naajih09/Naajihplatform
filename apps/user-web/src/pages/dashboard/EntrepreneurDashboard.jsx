import { MapPin, BadgeCheck, CheckCircle, Star } from "lucide-react";

export default function EntrepreneurProfile() {
  return (
    <div className="min-h-screen bg-background-dark text-white px-6 md:px-10 py-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {["HalalTech", "AgriBusiness", "SaaS", "IslamicFinance"].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 border border-white/10 rounded-full text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="lg:col-span-9 space-y-6">

          {/* Profile Header */}
          <div className="glass-card rounded-xl p-8 border-l-4 border-primary">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

              <div className="flex items-center gap-6">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2r_tger0mJhpRklOCkks7fjuTMv6lovNFS_0X-6jyFfGA8SjokccFzKc3YABVG4NMk0GC1e7DObcz5-M3kSuFKpyCLGd8Go_OKchoftrI7D28ZrWdLys9hivnM8A7ATh_-1LmxfDR59GtqBXLlQJg18hNQg3lXsCFLVsBoYjvEsMaqrw_VkAEfT-y6oPedf9scixd6KGvXTPnH36Z8HRj67-mq_h6r721L74ez3rFQQQnUvlXnvITAf07nk9yq8HG7PkgQgpDTL0"
                  className="w-28 h-28 rounded-2xl border-2 border-primary object-cover"
                  alt="Founder"
                />

                <div>
                  <h1 className="text-3xl font-extrabold">Ibrahim Musa</h1>
                  <p className="text-primary text-xs font-bold uppercase">
                    Founder @ AgriTech
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-white/70 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> Lagos, Nigeria
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <BadgeCheck size={14} /> Sharia-Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} /> KYC Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold">
                  Contact
                </button>
                <button className="px-6 py-2 bg-primary text-black rounded-lg text-sm font-bold">
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Growth", "+120%", "YoY"],
              ["Users", "5,400+", "Active"],
              ["Capital", "₦45M", "Raised"],
              ["Rating", "4.9", "Trust"],
            ].map(([label, value, sub]) => (
              <div
                key={label}
                className="glass-card rounded-xl p-4 text-center"
              >
                <p className="text-xs uppercase text-white/50">{label}</p>
                <p className="text-2xl font-black text-primary">{value}</p>
                <p className="text-[10px] text-white/40">{sub}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-xl font-bold mb-3">Business Bio</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Dedicated to revolutionizing agricultural supply chains in Nigeria
              through Sharia-compliant fintech solutions. We connect ethical
              investors with sustainable farming ventures using transparent
              profit-sharing models.
            </p>
          </div>

        </section>
      </div>
    </div>
  );
}
