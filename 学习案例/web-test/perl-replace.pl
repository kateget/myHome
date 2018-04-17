#!usr/bin/perl

print "Enter a number in Celsius:\n";
$celsius = <STDIN>; # 从用户处接受一个输入
chomp($celsius); #去掉$celsius后面的换行符

$celsius =~ s/(\.\d\d[1-9]?)\d*/$1/;
printf $celsius;