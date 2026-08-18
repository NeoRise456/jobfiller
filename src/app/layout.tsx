import type { Metadata } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "JOBFILLER — RESUME vs JOB. RAW VERDICT.",
  description:
    "Drop your resume. Paste the job. GLM-5.2 reasons over it and returns score, keywords, tailored resume, cover letter, interview prep.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {
          // DIRECTION CONTRACT lives in globals.css opening comment (seed key 43f20caa)
        }
        {children}
      </body>
    </html>
  );
}
