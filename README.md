<div id="top"></div>
<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
<h3 align="center">BookmarkManager</h3>

  <p align="center">
    A bookmark manager written in Go & JavaScript
    <br />
    <br />
    <a href="https://github.com/akaSyntaax/bookmarkmanager/issues">Report Bug</a>
    ·
    <a href="https://github.com/akaSyntaax/bookmarkmanager/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project
The aim of this project is to create a simple and secure bookmark manager which frees from relying on proprietary browser synchronisation.

### Note: **This is far from production ready. Most of the things don't work and the code is a mess. I don't recommend using this piece of software at the current stage, but if you're curious feel free to do so and let me know what you would like to be implemented!**

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

This project is created using the following awesome languages and frameworks

* [Go](https://go.dev)
* [Gin web framework](https://github.com/gin-gonic/gin)
* [React.js](https://reactjs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Building and running the docker image
1. Execute `sudo docker build https://github.com/akaSyntaax/bookmarkmanager.git\#:. -t akasyntaax/bookmarkmanager:latest` to build the image
2. You can then run the image by executing `sudo docker run --name bookmarkmanager -v /path/to/your/data/:/data -p 8000:8000 akasyntaax/bookmarkmanager:latest`
3. The app is now accessible at http://<your-ip>:8000

### Running the binary

I publish binaries for several operating systems and architectures on the [release page](https://github.com/akasyntaax/bookmarkmanager/releases).

1. Download the binary matching your os and architecture from the [release page](https://github.com/akasyntaax/bookmarkmanager/releases)
2. Unpack the archive to your preferred location
3. Create a file named `.env` in the same folder the binary is located and paste in the following:
```
PORT=8000
DB_PATH=./database.sqlite3
TRUSTED_PROXIES=127.0.0.1,::1
MODE=RELEASE
```
4. You can now execute the binary and access the ui at http://<your-ip>:8000

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Getting started with development
If you want to start developing you need to prepare a few things.

### Prerequisites

You need to have an installation of NodeJS (with npm) and Go. I used NodeJS 16 and Go 1.17 but newer version should also work fine.

### Steps to start developing

1. Clone the repository
2. Install the frontend dependencies by running `npm install` in the folder `frontend`
3. Open the folder with your favorite editor or ide
4. Make your changes to the code
5. To compile the frontend, cd into the folder `frontend` and run `npm run build`
6. After building the frontend, you can build the backend by running `go build .` in the projects root folder

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Use sqlite instead of mysql as data storage
- [ ] Create docker images
- [ ] Create browser extensions/bookmarklets
- [x] Add options to create bookmarks using the ui
- [ ] Add per user bookmarks/registration
- [ ] Create Android and iOS apps
- [ ] Multi-language Support
    - [ ] German

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Jan Hendrik Lübke - [@akaSyntaax](https://twitter.com/akaSyntaax) - hello[at]syntaax.dev

Project Link: [https://github.com/akaSyntaax/bookmarkmanager](https://github.com/akaSyntaax/bookmarkmanager)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

These great libraries and tools also made my life a lot easier

* [axios](https://github.com/axios/axios)
* [material-ui](https://github.com/mui/material-ui)
* [JetBrains GoLand](https://www.jetbrains.com/go/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/akaSyntaax/bookmarkmanager.svg?style=for-the-badge
[contributors-url]: https://github.com/akaSyntaax/bookmarkmanager/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/akaSyntaax/bookmarkmanager.svg?style=for-the-badge
[forks-url]: https://github.com/akaSyntaax/bookmarkmanager/network/members
[stars-shield]: https://img.shields.io/github/stars/akaSyntaax/bookmarkmanager.svg?style=for-the-badge
[stars-url]: https://github.com/akaSyntaax/bookmarkmanager/stargazers
[issues-shield]: https://img.shields.io/github/issues/akaSyntaax/bookmarkmanager.svg?style=for-the-badge
[issues-url]: https://github.com/akaSyntaax/bookmarkmanager/issues
[license-shield]: https://img.shields.io/github/license/akaSyntaax/bookmarkmanager.svg?style=for-the-badge
[license-url]: https://github.com/akaSyntaax/bookmarkmanager/blob/master/LICENSE.txt