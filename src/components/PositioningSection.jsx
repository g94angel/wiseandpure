import { memo } from 'react';

export default memo(function PositioningSection({ copy }) {
  return (
    <section className="positioning-band">
      <div className="container">
        <h2 className="positioning-title">{copy.positioning.title}</h2>
        <p className="positioning-body">{copy.positioning.body}</p>
      </div>
    </section>
  );
});
