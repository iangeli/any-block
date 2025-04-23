#region lane l1:
#region group g1:
if 1==2:
    print('1==2')
elif 1==1:
    print('1==1')
else:
    print('1!=1 && 1!=2')
#endregion

a = 'flag3'
match a:
    case 'flag1':
        print('a is flag1')
    case 'flag2':
        print('a is flag2')
#endregion

#region lane l2:
print('loop start')
while False:
    print('in loop body')
print('loop end')
#endregion

#region lane l1: