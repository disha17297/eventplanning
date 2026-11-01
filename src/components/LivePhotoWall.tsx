import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  QrCode, 
  Upload, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Share2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Users
} from 'lucide-react';
import { EventData, Language, MediaPhoto } from '../types';

interface LivePhotoWallProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const LivePhotoWall: React.FC<LivePhotoWallProps> = ({
  event,
  onUpdateEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const photos = event.photos || [];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Upload Form
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Slideshow auto-advance in fullscreen
  useEffect(() => {
    if (!isFullscreen || photos.length === 0) return;
    const timer = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isFullscreen, photos.length]);

  const handleLikePhoto = (photoId: string) => {
    const updatedPhotos = photos.map((p) => {
      if (p.id === photoId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    onUpdateEvent({ ...event, photos: updatedPhotos });
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const newPhoto: MediaPhoto = {
      id: `photo-${Date.now()}`,
      url: imageUrl.trim(),
      caption: caption.trim() || 'A cherished celebration moment ✨',
      uploadedBy: uploaderName.trim() || (isHi ? 'प्रिय अतिथि' : 'Guest'),
      timestamp: isHi ? 'अभी-अभी' : 'Just now',
      likes: 1,
    };

    const updated = [newPhoto, ...photos];
    onUpdateEvent({ ...event, photos: updated });
    setIsUploadModalOpen(false);
    setUploaderName('');
    setCaption('');
    setImageUrl('');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample curated moments to pick quickly
  const samplePicks = [
    {
      title: 'Baraat Celebration',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Sangeet Stage',
      url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Varmala Floral',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Haldi Petals',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b49a45]/15 text-[#8a7226] flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'लाइव फोटो वॉल व साझा एल्बम' : 'Collaborative Media Gallery & Live Photo Wall'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'मेहमान बिना किसी ऐप के QR कोड स्कैन करके अपनी सेल्फी व वीडियो लाइव स्टेज स्क्रीन पर भेज सकते हैं।' 
              : 'Crowdsourced event album: Guests scan venue QR code to upload photos directly to the live screen—no app download required.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] shadow-2xs cursor-pointer transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-[#b49a45]" />
            <span>{isHi ? 'QR कोड देखें' : 'Venue QR Code'}</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white shadow-xs cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#ffd97d]" />
            <span>{isHi ? '+ फोटो अपलोड करें' : '+ Upload Memory'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#12100d] hover:bg-[#23201b] text-white border border-[#b49a45]/40 shadow-xs cursor-pointer transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#ffd97d]" />
            <span>{isHi ? 'प्रोजेक्टर स्लाइड शो' : 'Projector Wall Mode'}</span>
          </button>
        </div>
      </div>

      {/* Gallery Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कुल फोटोज़' : 'Live Photos'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">{photos.length}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कुल प्यार / रिएक्शन्स' : 'Total Reactions'}
          </div>
          <div className="text-xl font-mono font-bold text-rose-600 mt-1">
            {photos.reduce((acc, p) => acc + p.likes, 0)} ❤️
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'सक्रिय योगदानकर्ता' : 'Active Contributors'}
          </div>
          <div className="text-xl font-mono font-bold text-[#1c5340] mt-1">
            {new Set(photos.map((p) => p.uploadedBy)).size}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'स्क्रीन स्टेटस' : 'Live Wall Feed'}
          </div>
          <div className="text-xs font-semibold text-[#1c5340] mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1c5340] animate-ping" />
            <span>{isHi ? 'लाइव सिंक सक्रिय' : 'Syncing Live'}</span>
          </div>
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => handleLikePhoto(photo.id)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{photo.likes}</span>
              </button>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-xs text-[var(--ink)] font-medium line-clamp-2">
                {photo.caption}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[var(--muted)] pt-1 border-t border-[var(--line)]">
                <span className="font-semibold text-[var(--ink)] truncate max-w-[150px]">
                  {photo.uploadedBy}
                </span>
                <span className="font-mono text-[10px]">{photo.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Scan Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {isHi ? 'वेन्यू लाइव क्यूआर कोड' : 'Venue Screen QR Code'}
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner mx-auto border-2 border-[#b49a45]">
              {/* Simulated crisp QR graphic */}
              <div className="w-48 h-48 bg-black flex flex-col justify-between p-3 rounded-lg text-white">
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-white p-1 rounded-sm"><div className="w-full h-full bg-black"></div></div>
                  <div className="w-12 h-12 bg-white p-1 rounded-sm"><div className="w-full h-full bg-black"></div></div>
                </div>
                <div className="text-center font-mono text-[10px] font-bold text-[#ffd97d] tracking-widest">
                  HOSTMATE LIVE
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-12 h-12 bg-white p-1 rounded-sm"><div className="w-full h-full bg-black"></div></div>
                  <Sparkles className="w-8 h-8 text-[#ffd97d]" />
                </div>
              </div>
            </div>

            <h3 className="font-serif font-bold text-base text-[var(--ink)]">
              {isHi ? 'स्कैन करें व लाइव स्क्रीन पर फोटो भेजें!' : 'Scan to Upload Directly to Live Screen!'}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {isHi 
                ? 'मेहमानों को कोई ऐप डाउनलोड नहीं करनी पड़ेगी। कैमरा खोलें और स्कैन करें।' 
                : 'No app download needed. Guests simply point their phone camera, snap a photo, and it appears on the live wedding wall.'}
            </p>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {isHi ? 'टेबल्स के लिए स्टैंडी प्रिंट करें' : 'Print Table Standee Cards'}
            </button>
          </div>
        </div>
      )}

      {/* Upload Memory Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h3 className="text-lg font-serif font-bold text-[var(--ink)]">
                {isHi ? 'लाइव वॉल पर फोटो जोड़ें' : 'Upload Event Memory'}
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'आपका नाम' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'कैप्शन / शुभकामना' : 'Caption / Warm Wish'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wishing the beautiful couple a lifetime of love! ✨💍"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'डिवाइस से फोटो चुनें' : 'Choose Photo File or Image URL'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="w-full text-xs text-[var(--muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1c5340] file:text-white hover:file:bg-[#164233] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                  {isHi ? 'या इन त्वरित मोमेंट्स में से चुनें:' : 'Or pick an instant wedding moment:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {samplePicks.map((pick, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(pick.url)}
                      className="p-1.5 rounded-lg border border-[var(--line)] hover:border-[#b49a45] text-left text-[11px] truncate cursor-pointer bg-[var(--bg-app)] text-[var(--ink)]"
                    >
                      {pick.title}
                    </button>
                  ))}
                </div>
              </div>

              {imageUrl && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-[var(--line)]">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1c5340] text-white hover:bg-[#164233] disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isHi ? 'वॉल पर पोस्ट करें' : 'Post to Live Wall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Projector Mode */}
      {isFullscreen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#b49a45] text-black font-serif font-bold text-sm flex items-center justify-center">
                HM
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold tracking-tight text-white">{event.title}</h2>
                <span className="text-xs text-[#ffd97d] font-sans">Live Venue Photo Wall</span>
              </div>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center max-h-[75vh] my-auto">
            <div className="relative max-h-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
              <img
                src={photos[slideshowIndex].url}
                alt="Slideshow"
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white flex items-center justify-between">
                <div>
                  <p className="text-base font-serif font-bold">{photos[slideshowIndex].caption}</p>
                  <p className="text-xs text-zinc-300">Uploaded by {photos[slideshowIndex].uploadedBy}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 font-bold text-sm">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{photos[slideshowIndex].likes}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-white/70 text-xs">
            <span>Slide {slideshowIndex + 1} of {photos.length}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSlideshowIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSlideshowIndex((prev) => (prev + 1) % photos.length)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
