export const getShareUrl = (itineraryId: string): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}/itinerary/${itineraryId}`;
};

export const shareToWhatsApp = (itineraryId: string, title: string): void => {
  const url = getShareUrl(itineraryId);
  const text = `בדוק את המסלול הזה: ${title}\n${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");
};

export const shareToFacebook = (itineraryId: string): void => {
  const url = getShareUrl(itineraryId);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, "_blank");
};

export const copyToClipboard = async (itineraryId: string): Promise<boolean> => {
  const url = getShareUrl(itineraryId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

