import { useCallback, useEffect, useState } from 'react';

const TESTIMONIAL_INTERVAL_MS = 30_000;

export function useTestimonialCarousel(testimonials) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Reset to first slide when the testimonial list changes (language switch)
  useEffect(() => {
    setActiveTestimonial(0);
  }, [testimonials]);

  // Restart the 30s timer whenever the active slide changes. No-ops until
  // there is more than one testimonial to rotate to.
  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = globalThis.setTimeout(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, TESTIMONIAL_INTERVAL_MS);
    return () => globalThis.clearTimeout(timer);
  }, [activeTestimonial, testimonials.length]);

  const handlePrevTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  }, [testimonials.length]);

  const handleNextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  }, [testimonials.length]);

  return { activeTestimonial, handlePrevTestimonial, handleNextTestimonial };
}
