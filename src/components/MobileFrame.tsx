/**
 * MobileFrame — constrains the app to a mobile-width container on all viewports.
 * Used for all routes except the landing page which is full-width.
 */
const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full min-h-screen flex justify-center bg-black">
    <div className="w-full max-w-[430px] min-h-screen relative">
      {children}
    </div>
  </div>
);

export default MobileFrame;
