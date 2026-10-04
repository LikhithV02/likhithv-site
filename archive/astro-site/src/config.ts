export const site = {
  name: 'Likhith V',
  email: 'likhithv02@gmail.com',
  github: 'https://github.com/LikhithV02',
  linkedin: 'https://www.linkedin.com/in/likhith-v-597643223/',
  youtube: 'https://www.youtube.com/@LikhithV02',
  instagram: 'https://www.instagram.com/likhith_explains/',
  x: 'https://x.com/LikhithV1253663',
  upwork: 'https://www.upwork.com/freelancers/~019e59954d43414ce0?mp_source=share',
  // Add your full Calendly event URL here, for example https://calendly.com/your-name/intro.
  calendly: ''
};

export const bookingUrl = site.calendly || `mailto:${site.email}?subject=Session%20request`;
export const bookingLabel = site.calendly ? 'Book a session' : 'Request a session';
