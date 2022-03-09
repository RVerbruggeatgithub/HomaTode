var levels =  [
		{
		start: {x:0,y:175}, 
		cash: 2200,
		background: "",
		theme: "desert",
		path: [{x:625,y:175}, {x:625,y:475}, {x:1025,y:475}, {x:1025,y:175}, {x:1550,y:175}, {x:1550,y:900}, {x:1075,y:900}, {x:1075,y:575}, {x:625,y:575}, {x:625,y:900}, {x:300,y:900}],
		platforms: [
		{x:450, y:250, height:175, width: 125},
		{x:700, y:150, height:275, width: 250},
		{x:1100, y:250, height:75, width: 325},
		{x:700, y:525, height:0, width: 350},
		{x:750, y:650, height:300, width: 250},
		{x:1300, y:675, height:175, width: 150},
		{x:450, y:525, height:300, width: 125}
		],
		wave: [
			{group_size: 30, type: 'Azaries', delay: 5, spread: 12},
			{group_size: 25, type: 'Gurhabs', delay: 30, spread: 22}, 
			{group_size: 10, type: 'Valcheraks', delay: 50, spread: 18},
			{group_size: 40, type: 'Azaries', delay: 75, spread: 12},
			{group_size: 25, type: 'Earanours', delay: 90, spread: 30}, 
			{group_size: 20, type: 'Gurhabs', delay: 105, spread: 22},
			{group_size: 10, type: 'Gurhabs', delay: 130, spread: 22}, 
			{group_size: 35, type: 'Valcheraks', delay: 150, spread: 18},,
			{group_size: 50, type: 'Azaries', delay: 170, spread: 12}, 
			{group_size: 25, type: 'Gurhabs', delay: 190, spread: 22}, 
			{group_size: 40, type: 'Azaries', delay: 275, spread: 12},
			{group_size: 40, type: 'Gurhabs', delay: 325, spread: 22},
			{group_size: 20, type: 'Gurhabs', delay: 360, spread: 22},
			{group_size: 50, type: 'Azaries', delay: 400, spread: 12},
			{group_size: 20, type: 'Azaries', delay: 465, spread: 12},
			{group_size: 1, type: 'Tharak', delay: 480, spread: 20},
			{group_size: 20, type: 'Azaries', delay: 500, spread: 12},
			],
		},
		{
		start: {x:700,y:0}, 
		cash: 1800,
		background: "",
		theme: "desert",
		path: [{x:700,y:300}, {x:1000,y:300}, {x:1000,y:100}, {x:700,y:100}, {x:700,y:300}, {x:450,y:300}, {x:450,y:100}, {x:450,y:800}, {x:900,y:800}, {x:900,y:600}, {x:50,y:600}, {x:50,y:800}, {x:1000,y:800}],
		platforms: [{x:775, y:175, height:75, width: 150},
					{x:525, y:0, height:250, width: 125},
					{x:525, y:350, height:200, width: 475},
					{x:200, y:425, height:125, width: 200},
					{x:125, y:675, height:75, width: 300},
					{x:525, y:675 , height:75, width: 275},
					{x:225, y:850 , height:50, width: 625}],
		wave: [/*{group_size: 10, type: 'Gurhabs', delay: 5},
			{group_size: 50, type: 'Val Tharaks', delay: 20}, 
			{group_size: 3, type: 'Behemoths', delay: 35}, 
			{group_size: 10, type: 'Gurhabs', delay: 45},
			{group_size: 50, type: 'Val Tharaks', delay: 60},
			{group_size: 10, type: 'Gurhabs', delay: 80}, 
			{group_size: 1, type: 'Bhamut', delay: 100}, 
			{group_size: 2, type: 'Behemoths', delay: 120}, */
			{group_size: 75, type: 'Azaries', delay: 1, spread: 12},
			{group_size: 1, type: 'Darloki', delay: 5, spread: 50}
			/*{group_size: 50, type: 'Gurhabs', delay: 150}, 
			{group_size: 1, type: 'Bhamut', delay: 120}, 
			{group_size: 100, type: 'Azaries', delay: 220},
			{group_size: 50, type: 'Gurhabs', delay: 245},
			
			{group_size: 25, type: 'Gurhabs', delay: 255}*/
			],
		},
		]