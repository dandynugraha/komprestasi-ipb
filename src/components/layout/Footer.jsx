import { Camera, MessageCircle } from "lucide-react";
import siteConfig from "@/config/site.config";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <a href={siteConfig.social.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-royal-600 transition-colors font-medium">
              <Camera size={14} /> {siteConfig.social.instagram.handle}
            </a>
            <a href={siteConfig.social.whatsapp.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-royal-600 transition-colors font-medium">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
          <p className="text-[11px] text-zinc-400">{siteConfig.copyright} &middot; {siteConfig.managedBy}</p>
        </div>
      </div>
    </footer>
  );
}
