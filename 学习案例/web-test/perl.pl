#!usr/bin/perl

print "Enter a temperature in Celsius:\n";
$celsius = <STDIN>; # 从用户处接受一个输入
chomp($celsius); #去掉$celsius后面的换行符

if($celsius =~ m/^([-+]?[0-9]+(\.[0-9]*)?)([CF])$/){
	$fahrenheit = ($celsius * 9 / 5) +32;#计算华氏温度
	printf "%.2f C is %.2f F.\n",$celsius,$fahrenheit;
}else{
	printf "Expecting a number,so I don't understand\"$celsius\".\n"
}