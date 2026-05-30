import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

// Falls dein utils-Import anders aussieht, behalte deinen ursprünglichen bei!
import { cn } from "./utils" 

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* Der graue Hintergrund-Balken */}
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/10">
      {/* Der ausgefüllte, neongrüne Bereich */}
      <SliderPrimitive.Range className="absolute h-full bg-[#00e676]" />
    </SliderPrimitive.Track>
    
    {/* Der runde, neongrüne Anfasser (Thumb) mit schwarzem Rand und Glow */}
    <SliderPrimitive.Thumb className="block h-[22px] w-[22px] cursor-pointer rounded-full border-2 border-black bg-[#00e676] shadow-[0_0_0_1px_rgba(0,230,118,0.3)] transition-shadow hover:shadow-[0_0_0_4px_rgba(0,230,118,0.2)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }