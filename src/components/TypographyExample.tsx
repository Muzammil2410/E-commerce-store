/**
 * Typography Example Component
 * 
 * This component demonstrates the proper usage of the global typography system:
 * - Poppins for headings (font-weight 600-700)
 * - Inter for body text (font-weight 400-500)
 * 
 * All typography is applied globally via CSS, so no font families need to be
 * hardcoded in components. Simply use semantic HTML elements and Tailwind utilities.
 */

export default function TypographyExample() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Headings - Automatically use Poppins with font-weight 600-700 */}
      <section className="space-y-4">
        <h1>Heading 1 - Main Title</h1>
        <h2>Heading 2 - Section Title</h2>
        <h3>Heading 3 - Subsection Title</h3>
        <h4>Heading 4 - Minor Heading</h4>
        <h5>Heading 5 - Small Heading</h5>
        <h6>Heading 6 - Smallest Heading</h6>
      </section>

      {/* Body Text - Automatically uses Inter with font-weight 400 */}
      <section className="space-y-4">
        <p className="font-normal">
          This is normal body text using Inter with font-weight 400. It provides
          excellent readability for paragraphs and general content. The line height
          is set to 1.65 for optimal reading experience.
        </p>
        
        <p className="font-medium">
          This is medium body text using Inter with font-weight 500. Use this
          for emphasized body content or when you need slightly more visual weight
          without using a heading.
        </p>
      </section>

      {/* Semantic Typography Examples */}
      <section className="space-y-4">
        <article>
          <h2 className="mb-4">Article Title</h2>
          <p className="font-normal mb-4">
            This demonstrates a typical article structure. The heading automatically
            uses Poppins with font-weight 700, while the body text uses Inter with
            font-weight 400. No additional font classes are needed.
          </p>
          <p className="font-normal">
            The typography system ensures consistent visual hierarchy throughout
            the application. All headings maintain proper spacing and weight,
            creating a professional and modern appearance.
          </p>
        </article>
      </section>

      {/* Utility Class Examples */}
      <section className="space-y-4">
        <h3>Using Tailwind Utilities</h3>
        <p className="font-normal text-base">
          Base text size (16px) with normal weight (400)
        </p>
        <p className="font-medium text-base">
          Base text size (16px) with medium weight (500)
        </p>
        <p className="font-semibold text-lg">
          Large text with semibold weight (600) - useful for emphasis
        </p>
        <p className="font-bold text-xl">
          Extra large text with bold weight (700) - for strong emphasis
        </p>
      </section>

      {/* Semantic Font Family Utilities */}
      <section className="space-y-4">
        <h3>Semantic Font Family Utilities</h3>
        <p className="font-heading font-semibold text-lg">
          This text uses font-heading utility (Poppins) with semibold weight
        </p>
        <p className="font-heading font-bold text-xl">
          This text uses font-heading utility (Poppins) with bold weight
        </p>
        <p className="font-body font-normal">
          This text explicitly uses font-body utility (Inter) with normal weight
        </p>
        <p className="font-body font-medium">
          This text explicitly uses font-body utility (Inter) with medium weight
        </p>
      </section>

      {/* Responsive Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl">
          Responsive Heading
        </h2>
        <p className="text-sm md:text-base lg:text-lg font-normal">
          Body text that scales appropriately across different screen sizes while
          maintaining readability and the Inter font family.
        </p>
      </section>
    </div>
  );
}

