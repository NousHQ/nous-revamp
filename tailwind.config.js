const { fontFamily } = require("tailwindcss/defaultTheme")
const colors = require('@radix-ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        blue: colors.blue,
        greenA: {
          1: colors.greenA.greenA1,
          2: colors.greenA.greenA2,
          3: colors.greenA.greenA3,
          4: colors.greenA.greenA4,
          5: colors.greenA.greenA5,
          6: colors.greenA.greenA6,
          7: colors.greenA.greenA7,
          8: colors.greenA.greenA8,
          9: colors.greenA.greenA9,
          10: colors.greenA.greenA10,
          11: colors.greenA.greenA11,
          12: colors.greenA.greenA12
        },
        green: {
          1: colors.green.green1,
          2: colors.green.green2,
          3: colors.green.green3,
          4: colors.green.green4,
          5: colors.green.green5,
          6: colors.green.green6,
          7: colors.green.green7,
          8: colors.green.green8,
          9: colors.green.green9,
          10: colors.green.green10,
          11: colors.green.green11,
          12: colors.green.green12
        },

        sage: {
          1: colors.sage.sage1,
          2: colors.sage.sage2,
          3: colors.sage.sage3,
          4: colors.sage.sage4,
          5: colors.sage.sage5,
          6: colors.sage.sage6,
          7: colors.sage.sage7,
          8: colors.sage.sage8,
          9: colors.sage.sage9,
          10: colors.sage.sage10,
          11: colors.sage.sage11,
          12: colors.sage.sage12,
        },
        // border: "(var(--border))",
        // input: "(var(--input))",
        // ring: "(var(--ring))",
        // background: "#d8ffd8",
        // foreground: "(var(--foreground))",
        // primary: {
        //   DEFAULT: "#065B07",
        //   foreground: "(var(--primary-foreground))",
        // },
        // secondary: {
        //   DEFAULT: "(var(--secondary))",
        //   foreground: "(var(--secondary-foreground))",
        // },
        // destructive: {
        //   DEFAULT: "(var(--destructive))",
        //   foreground: "(var(--destructive-foreground))",
        // },
        // muted: {
        //   DEFAULT: "(var(--muted))",
        //   foreground: "(var(--muted-foreground))",
        // },
        // accent: {
        //   DEFAULT: "(var(--accent))",
        //   foreground: "(var(--accent-foreground))",
        // },
        // popover: {
        //   DEFAULT: "(var(--popover))",
        //   foreground: "(var(--popover-foreground))",
        // },
        // card: {
        //   DEFAULT: "(var(--card))",
        //   foreground: "(var(--card-foreground))",
        // },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}
