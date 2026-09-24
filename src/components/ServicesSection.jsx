import { memo } from 'react';

export default memo(function ServicesSection({ copy, services }) {
  return (
    <section className="lang-section text-center">
      <div className="container">
        <h2 className="mb-4">{copy.servicesTitle}</h2>
        <p className="lead">{copy.servicesBody}</p>
        <div className="services-grid">
          {services.map((service) => (
            <div className="services-card" key={service.title}>
              <i
                className={`bi ${service.icon} fs-1 text-primary mb-3`}
                aria-hidden="true"
              ></i>
              <h5>{service.title}</h5>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
