# Solve Crypto With Force (SCWF)

CTF tool for identifying, brute forcing and decoding encryption schemes in an automated way.

[Click here](https://scwf.dima.ninja/) for the live version (use Chrome).

Crypto CTF (sub)challenges can roughly be categorized as follows:
1. Weak implementation/configuration of strong cryptographic schemes (e.g. RSA based challenges)
2. Weak cryptographic cipher usage (e.g. Vigenère)
3. Obfuscation (e.g. Skip, Railfence)
4. Encodings (e.g. Base32, Morse)

While case 1 is arguably the most fun to solve, cases 2 to 4 are still used in CTFs, i.e. CyberLympics. It can take a lot of time figuring out what it exactly is. This is especially true since no available tool does the identification of which cipher/encoding is used.

Solve Crypto With Force (SCWF) was created in 2014 as a "scratch your own itch" to automate the identification and decryption of the above mentioned cases 2 to 4 in certain CTF's (*cough* CyberLympics). This allowed brainpower to be used for other, more fun challenges to be solved.

SCWF uses statistical analysis to identify which encoding or encryption is used and grade the output using a dictionary. It will grade each output by identifying English words, links and flags. You input a challenge in the top textarea and it will make a graph in an attempt to solve it.

![alt text][example]
A graph that is created within a few seconds from this example input: [2016 Internetwache CTF - crypto pirate 50](https://github.com/ctfs/write-ups-2016/tree/master/internetwache-ctf-2016/crypto/crypto-pirat-50)

Currently, the following ciphers can be identified and solved fully or to a certain extent: 
![alt text][currentcap]


## Getting Started

[Click here](https://scwf.dima.ninja/) for the live version.

For offline use: clone all and open index.html.

Optional: Host /ServerSidePHP/ folder on your own server and point "var lookup_proxy_host" to your own server.

Support: The code is only tested for Chrome on a 1080p normal-PPI screen. However, Firefox on Linux also seems to work reasonably well.


## Running the tests

Manual testing can be done by pasting your obfuscated string or one from DECRYPTME.txt in the top textarea.

Running automated tests is as easy as hitting the top-right "Test-Mode" button. Every time a new cipher is added, add one extra test case in js/TestCases.js .


## Acknowledgments

For testing, brainstorming and bug reports :smile:
* Hack.ERS
* dotelite

All other projects I borrowed code from!

## License

This project is licensed under the GNU General Public License v3.0.


[example]: https://github.com/DaWouw/SCWF/raw/master/media/SCWF-example.gif "Example of running SCWF"
[currentcap]: https://github.com/DaWouw/SCWF/raw/master/media/SCWF-current-cap.png "Currently supported algorithms"
