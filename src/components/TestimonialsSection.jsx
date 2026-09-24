import { memo } from 'react';
import { useTestimonialCarousel } from '../hooks/useTestimonialCarousel';

export default memo(function TestimonialsSection({ copy, testimonials }) {
  const { activeTestimonial, handlePrevTestimonial, handleNextTestimonial } =
    useTestimonialCarousel(testimonials);

  return (
    <section className="lang-section text-center">
      <div className="container">
        <h2 className="mb-4">{copy.testimonialsTitle}</h2>

        <blockquote className="testimonial-lead">
          <p>“{copy.testimonialsLead.quote}”</p>
          <cite>— {copy.testimonialsLead.author}</cite>
        </blockquote>

        <p className="lead">{copy.testimonialsBody}</p>
        {testimonials.length > 0 && (
          <section
            id="testimonialCarousel"
            className="carousel slide"
            aria-label={copy.testimonialsAria}
            aria-live="polite"
          >
            <div className="carousel-inner">
              {testimonials.map((testimonial, index) => (
                <div
                  className={`carousel-item${index === activeTestimonial ? ' active' : ''}`}
                  key={testimonial.author}
                >
                  <div className="card text-center p-3">
                    <p className="card-text">{testimonial.quote}</p>
                    <p className="card-text">- {testimonial.author}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              aria-label={copy.previousTestimonial}
              onClick={handlePrevTestimonial}
            >
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button
              className="carousel-control-next custom-control"
              type="button"
              aria-label={copy.nextTestimonial}
              onClick={handleNextTestimonial}
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </section>
        )}
      </div>
    </section>
  );
});
