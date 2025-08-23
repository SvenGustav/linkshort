# README.md

# URL Shortener

This project is a simple URL shortener built with Node.js and TypeScript. It allows users to shorten long URLs and redirect to the original URLs using the generated short links.

## Features

- Generate short URLs
- Redirect to original URLs
- Easy to deploy online

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/url-shortener.git
   ```

2. Navigate to the project directory:
   ```
   cd url-shortener
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` file and configure your environment variables.

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Access the application at `http://localhost:3000`.

## API Endpoints

- `POST /shorten`: Create a short URL.
- `GET /:shortId`: Redirect to the original URL.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.