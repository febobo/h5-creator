module.exports = {
	DB : {
		PORT: 27017,
		HOST: "192.168.1.13",
		USER: "root",
		PASSWORD: "root",
		NAME: "creator" 
	},
	TELNET : {
	 	HOST 	: '123.56.98.160',		//Host the client should connect to
	 	PORT  	: '2225',				//Port the client should connect to
	 	IRS 	: '\r\n',				//Input record separator. A separator used to distinguish between lines of the response. Defaults to '\r\n'.
	 	CHARSET 	: 'utf-8',
	 	TIMEOUT 	: 1000 ,			
	 	SYSID		: '22',				//在 http://ym2.corp.wn518.com:8405/ 系统管理中，数据后台系统的ID
	 	MCODE		: 'index',			//任意指定一个
	}
}
