all: install-common install-player install-admin chmod chmod-fish
install-common:
	 cd Common && /opt/rh/rh-nodejs10/root/usr/bin/npm install

chmod:
	#chmod +x ./fish
	chmod +x ./xtest

chmod-fish:
	cd Common && chmod +x ./fish

install-player:
	#chmod +x ./fish
	cd Player && /opt/rh/rh-nodejs10/root/usr/bin/npm install

install-admin:
	#chmod +x ./fish
	cd Admin && /opt/rh/rh-nodejs10/root/usr/bin/npm install


#ben enables it himself