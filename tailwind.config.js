const { nextui } = require("@nextui-org/react");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif", ...defaultTheme.fontFamily.sans],
      serif: ["Georgia", "Merriweather", ...defaultTheme.fontFamily.serif],
      mono: ["Fira Code", "monospace", ...defaultTheme.fontFamily.mono],
      display: ["Montserrat", "sans-serif", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      screens: {
        xs: "360px", //<650px
        sm: "640px", //>=650px
        md: "768px", //>=960px
        lg: "1024px", //>=1280px
        xl: "1280px", //>=1400px
        "2xl": "1536px",
        "3xl": "1920px",
        "4xl": "2560px",
        "5xl": "3840px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      addCommonColors: true,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
        dividerWeight: "1px",
        disabledOpacity: 0.5,
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "8px",
          medium: "12px",
          large: "14px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        light: {
          layout: {
            hoverOpacity: 0.8,
            boxShadow: {
              small:
                "0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
              medium:
                "0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
              large:
                "0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
            },
          },
          // colors: {
          //   background: "#FFFFFF",
          //   foreground: "#11181C",
          //   primary: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#006FEE",
          //   },
          //   secondary: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#7828C8",
          //   },
          //   success: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#17C964",
          //   },
          //   warning: {
          //     foreground: "#000000",
          //     DEFAULT: "#F5A524",
          //   },
          //   danger: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#F31260",
          //   },
          //   info: {
          //     foreground: "#000000",
          //     DEFAULT: "#7EE7FC",
          //   },
          // },
        },
        dark: {
          layout: {
            hoverOpacity: 0.9,
            boxShadow: {
              small:
                "0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              medium:
                "0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              large:
                "0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
            },
          },
          // colors: {
          //   background: "#000000",
          //   foreground: "#ECEDEE",
          //   primary: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#006FEE",
          //   },
          //   secondary: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#9353D3",
          //   },
          //   success: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#45D483",
          //   },
          //   warning: {
          //     foreground: "#000000",
          //     DEFAULT: "#F7B750",
          //   },
          //   danger: {
          //     foreground: "#FFFFFF",
          //     DEFAULT: "#F54180",
          //   },
          //   info: {
          //     foreground: "#000000",
          //     DEFAULT: "#A5EEFD",
          //   },
          // },
        },
        mytheme: {
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#BEF264",
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
};
