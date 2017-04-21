from __future__ import division
import math

def is_square(apositiveint):
  x = apositiveint // 2
  seen = set([x])
  while x * x != apositiveint:
    x = (x + (apositiveint // x)) // 2
    if x in seen: return False
    seen.add(x)
  return True

def reducefract(n, d):
    def gcd(n, d):
        while d != 0:
            t = d
            d = n%d
            n = t
        return n
    assert d!=0, "integer division by zero"
    assert isinstance(d, int), "must be int"
    assert isinstance(n, int), "must be int"
    greatest=gcd(n,d)
    n/=greatest
    d/=greatest
    return (n, d)

def calc_array(x):
    temp = (x[-1],1)
    for i in range(len(x)-2,-1,-1):
        a = x[i]
        num = temp[0]
        den = temp[1]
        aux = a*num + den
        temp = reducefract(int(aux),int(num))
    return temp


def from_root(n):
    a0 = int(math.floor(math.sqrt(n)))
    r = (a0, [])
    a, b, c = 1, 2 * a0, a0 ** 2 - n
    delta = math.sqrt(4*n)

    while True:
        try:
            d = int((b + delta) / (2 * c))
        except ZeroDivisionError: # a perfect square
            return (r[0],)
        a, b, c = c, -b + 2*c*d, a - b*d + c*d ** 2
        r[1].append(abs(d))
        if abs(a) == 1:
            break
    if (len(r[1])%2 == 0):
        print "m is even"
    else:
        print "m is odd"
    return r

def aux_plug(p,q,d):
    return p**2 + d*q**2

if __name__ == "__main__":
    print from_root(312)
    print calc_array([17,1,2,4,11,1,1,3,2,2,3,1,1,11,4,2,1])
    print aux_plug(126862368,7170685,313)
