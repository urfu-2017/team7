/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html lang="ru">
                <Head>
                    <title>team7chat</title>
                    <link rel="stylesheet" href="/static/semantic-ui-2.2.14/semantic.min.css" />
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
