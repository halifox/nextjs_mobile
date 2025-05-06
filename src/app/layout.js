'use client'

import "./globals.css";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {ThemeProvider} from 'next-themes'
import {App, ConfigProvider, theme as antdTheme} from "antd";
import {Suspense, useEffect, useState} from "react";

export default function RootLayout({children}) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const handleChange = (darkModeQuery) => {
        setIsDarkMode(darkModeQuery.matches);
    };
    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        handleChange(darkModeQuery)
        darkModeQuery.addEventListener('change', handleChange);
        return () => darkModeQuery.removeEventListener('change', handleChange);
    }, []);
    return (
        <html lang="zh" suppressHydrationWarning={true}>
        <body style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            width: '61vh',
        }}>
            <AntdRegistry>
                <ThemeProvider>
                    <ConfigProvider
                        theme={{
                            algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                        }}
                    >
                        <App style={{
                            width: '100%',
                        }}>
                            <Suspense>
                                {children}
                            </Suspense>
                        </App>
                    </ConfigProvider>
                </ThemeProvider>
            </AntdRegistry>
        </div>

        </body>
        </html>
    );
}
