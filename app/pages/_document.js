/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html lang="ru">
                <Head>
                    <title>team7chat</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                    <link rel="stylesheet" href="/_next/static/style.css" />
                    <link rel="icon" type="image/png" href="/static/logo.png" />
                    <style>{`body, html {
                                overflow: hidden;
                                background-color: #E7EBF0;
                             }`}
                    </style>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
