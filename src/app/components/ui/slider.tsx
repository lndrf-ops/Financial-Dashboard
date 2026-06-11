import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    // HIER: Das cn() wurde durch einen normalen Template-String ersetzt
    className={`relative flex w-full touch-none select-none items-center cursor-pointer ${className || ""}`}
    {...props}
  >
    {/* Der Hintergrund (Track) in weichem Schiefergrau */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-800">
      {/* Die gefüllte Leiste (Range) in Indigo */}
      <SliderPrimitive.Range className="absolute h-full bg-indigo-500" />
    </SliderPrimitive.Track>
    
    {/* Der Anfasser (Thumb) */}
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-500 bg-white ring-offset-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }