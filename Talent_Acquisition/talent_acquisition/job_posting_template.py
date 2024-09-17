template_list = [{'id':1,'name':'Template-1'},{'id':2,'name':'Template-2'},{'id':3,'name':'Template-3'}]

#template 1
def template1(jname,cdate,dsc,loc):
    return """
    <html>
    
    <head>
    
    <meta name="pdfkit-page-size" content="Legal"/>
    <meta name="pdfkit-orientation" content="Landscape"/>
        <title>Responsive Email Template</title>
        <style type="text/css">
            .logo {}
        </style>
    </head>
    
    <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="font-family: 'poppins'">
        <table width="100%" border="0" height="1145" style="background: url(http://mynext.nexttechnosolutions.com/media/template_images/d1-bg.jpg);background-repeat: no-repeat;background-position: top;background-size: contain;">
            <tbody>
                <tr>
                    <td width="35%" height="138">&nbsp;</td>
                    <td width="24%">&nbsp;</td>
                    <td width="41%" align="right"><img src="http://mynext.nexttechnosolutions.com/media/template_images/next-logo.png"></td>
                </tr>
                <tr>
                    <td rowspan="5" style="font-size: 80px; color: #FFFFFF; font-weight:500">
                        <p>&nbsp;</p>
                        <p style="
        margin-top: -500px;
    ">SEEKING
                            <br>A NEW
                            <br>CAREER?</p>
                    </td>
                   <td height"326">&nbsp;</td>
                    <td height ="300" align="right"><span style="font-size: 14px; color: #429be1">Job Name</span>
                        <br><span style="font-size: 24px;font-weight: 500 ">"""+str(jname)+"""</span>
                        <br><span style="text-align:  justify;  font-size: 18px">"""+str(dsc)+"""</span></td>
                </tr>
                <tr>
                    <td height="773" rowspan="4" align="center">
                        <p style="
        margin-top: -387px;
    "><span style=" font-size:40px; color:#fff; font-weight: 500">Who we are</span>
                            <br>
                            <span style="font-size:16px; color:#fff">NEXT Inc, a pioneer in Digital Revolution,<br>sets itself apart through solutions that are <br>
    <br>synonymous of digital transformation, innovation 
and value delivery across different industrial streams 
and verticals. We are committed to delivering solutions that 
are futuristic and ensure assured returns to our Customers, 
Stakeholders, Technology Partners and Employees. structure Solutions 
to our valued client base. Our Digital Enterprise Solutions and Digital 
Infrastructure Solutions can enable, empower and energize the drive for 
effective solutions in upcoming generations.</span></p>
                    </td>
                    <td align="right">
                        <table width="100%" border="0">
                            <tbody>
                                <tr>
                                    <td width="91%" height="60" align="right"><span style="font-size: 14px; color: #429be1">Close Date</span>
                                        <br><span style="font-size: 18px;font-weight: 600">"""+str(cdate)+"""</span></td>
                                    <td align="center" width="9%"><img src="http://mynext.nexttechnosolutions.com/media/template_images/date.png" width="30" height="30"></td>
                                </tr>
                                <tr>
                                    <td height="60" align="right"><span style="font-size: 14px; color: #429be1">Location</span>
                                        <br><span style="font-size: 18px;font-weight: 600">"""+str(loc)+"""</span></td>
                                    <td align="center"><img src="http://mynext.nexttechnosolutions.com/media/template_images/location.png" width="22" height="30"></td>
                                </tr>
                                <tr>
                                    <td height="60" align="right"><span style="font-size: 14px; color: #429be1">Apply Here</span>
                                        <br><span style="font-size: 18px;font-weight: 600">www.nexttechnosolutions.com</span></td>
                                    <td align="center"><img src="http://mynext.nexttechnosolutions.com/media/template_images/web.png" width="30" height="30"></td>
                                </tr>
                                <tr>
                                    <td align="right" colspan="2">&nbsp;</td>
                                </tr>
                            </tbody>
                        </table><span style="font-size: 18px"><b>NEXT Techno Enterprises PVT LTD</b><br>
    Module No: 308/1, Third Floor<br>
    ELCOT IT/ITES-SEZ,TIDEL PARK<br>
    Coimbatore - 641 014 <br>
    Tamil Nadu.<br>
    +91 422-2971111/1112/1113</span></td>
                </tr>
    
            </tbody>
        </table>
    </body>
    
    </html>
    """
#template 2
def template2(jname,cdate,dsc,loc):
    return """
    <!DOCTYPE html>
<html>
<head>
    <meta name="pdfkit-page-size" content="Legal"/>
    <meta name="pdfkit-orientation" content="Landscape"/>
    <title>Responsive Email Template</title>
<style type="text/css">
.logo {
}
</style>
</head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="font-family: 'poppins'">
    <table width="100%" border="0" height="1258" style="background: url(http://mynext.nexttechnosolutions.com/media/template_images/d2-bg.jpg); background-repeat: no-repeat; background-position: top; background-size: contain;">
      <tbody>
        
        <tr>
          <td width="28%" rowspan="7" style="font-size: 65px; color: #fff; font-weight:500;">
          <p style="margin-top: -350px">BUILD<br>YOUR<br>CAREER<br>WITH<br>US</p></td>
          <td height="220" colspan="3"><span style="font-size: 14px; color: #429be1;">Job Name</span><br><span style="font-size: 24px;font-weight: 500 ">"""+str(jname)+"""</span><br><span style="text-align: justify; text-justify: auto; font-size: 18px">
          """+str(dsc)+"""</span>
        
           
            <table width="100%" border="0" style="margin-top: 24px">
              <tbody>
                <tr>
                 <td width="1%">&nbsp;</td>
                  <td width="3%" height="60"><img src="http://mynext.nexttechnosolutions.com/media/template_images/date.png" width="45" height="45"/></td>
                  <td width="24%"><span style="font-size: 14px; color: #429be1">Close Date</span><br>
                    <span style="font-size: 18px;font-weight: 500">"""+str(cdate)+"""</span></td>
                  <td width="3%"><img src="http://mynext.nexttechnosolutions.com/media/template_images/location.png" width="37" height="45"/></td>
                  <td width="19%"><span style="font-size: 14px; color: #429be1">Location</span><br>
                    <span style="font-size: 18px;font-weight: 500">"""+str(loc)+"""</span></td>
                  <td width="3%"><img src="http://mynext.nexttechnosolutions.com/media/template_images/web.png" width="45" height="45"/></td>
                  <td width="45%"><span style="font-size: 14px; color: #429be1">Apply Here</span><br>
                    <span style="font-size: 18px;font-weight: 500">www.nexttechnosolutions.com</span></td>
                  
                  <td width="2%">&nbsp;</td>
                </tr>
              </tbody>
          </table></td>
        </tr>
       
        <tr>
          <td height="380" colspan="2" rowspan="5" align="left"><p><span style=" font-size:60px; color:#000; font-weight: 500" >Who we are</span><br>
            <span style="font-size:14px; color:#000">NEXT Inc, a pioneer in Digital Revolution,<br>sets itself apart through solutions that are <br>
              synonymous of digital transformation, innovation 
              and value delivery across different industrial streams 
              and verticals. We are committed to delivering solutions that 
              are futuristic and ensure assured returns to our Customers, 
              Stakeholders, Technology Partners and Employees. structure Solutions 
              to our valued client base. Our Digital Enterprise Solutions and Digital 
              Infrastructure Solutions can enable, empower and energize the drive for 
          effective solutions in upcoming generations.</span></p></td>
          
          <td width="23%" align="right" style=" padding-top: 260px"><span style="font-size: 20px; color:#fff; padding-top: 260px"><b>NEXT Techno Enterprises PVT LTD</b><br>
                                                    Module No: 308/1, Third Floor<br>
                                                    ELCOT IT/ITES-SEZ,TIDEL PARK<br>
                                                    Coimbatore - 641 014 <br>
                                                    Tamil Nadu.<br>
                                                    +91 422-2971111/1112/1113</span></td>
        </tr>
        
        <tr>
          <td colspan="3" align="right">&nbsp;</td>
        </tr>
      </tbody>
    </table>
    <!-- Wrapper -->
<!--
    <table align="center" cellpadding="0" cellspacing="0" width="100%" height="1152px" style="background: url(http://mynext.nexttechnosolutions.com/media/template_images/d1-bg.jpg)">
      <tr>
        <td width="50%" class="logo">
          <img src="next-logo.png"/>
                    
                     </td>
                    </tr>
                  </table>
-->
                </body>
</html>
    """

#template 3
def template3(jname,cdate,dsc,loc):
    return """
<!DOCTYPE html>
<html>
<head>
    <meta name="pdfkit-page-size" content="Legal"/>
    <meta name="pdfkit-orientation" content="Landscape"/>
    <title>Responsive Email Template</title>
<style type="text/css">
.logo {
}
</style>
</head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="font-family: 'poppins'">
    <table width="100%" border="0" height="1136" style="background: url(http://mynext.nexttechnosolutions.com/media/template_images/d3-bg.jpg); background-repeat: no-repeat; background-position: top; background-size: contain;">
      <tbody>
        
        <tr>
          <td  valign="bottom" width="27%" rowspan="7" style="font-size: 76px; color: #000; font-weight:500; position: sticky">
          <p style="margin-bottom: 481px;">Are you<br>
          Right for<br>
          The Job?</p></td>
          <td height="335" colspan="3"><p>&nbsp;</p>
            <p>&nbsp;</p>
            <p><span style="font-size: 14px; color: #429be1;">Job Name</span><br>
              <span style="font-size: 24px;font-weight: 500 ">"""+str(jname)+"""</span><br>
              <span style="text-align: justify; text-justify: auto; font-size: 18px">"""+str(dsc)+"""</span>
              
              
            </p>
            <table width="100%" border="0" style="margin-top: 24px">
              
                
                 <td width="4%">&nbsp;</td>
                 <tr>
                  <td width="4%" height="60" valign="center"><img src="http://mynext.nexttechnosolutions.com/media/template_images/date.png" width="45" height="45"/></td>
                  <td width="94%"><span style="font-size: 14px; color: #429be1">Close Date</span><br>
              <span style="font-size: 18px;font-weight: 500">"""+str(cdate)+"""</span></td> </tr>
                   <td width="4%">&nbsp;</td>
                    <tr>
                  <td width="4%" height="60" valign="center"><img src="http://mynext.nexttechnosolutions.com/media/template_images/location.png" width="37" height="45"/></td>
                  <td width="94%"><span style="font-size: 14px; color: #429be1">Location</span><br>
                    <span style="font-size: 18px;font-weight: 500">"""+str(loc)+"""</span></td></tr>
                    <td width="4%">&nbsp;</td>
                    <tr>
                  <td width="4%" height="60" valign="center"><img src="http://mynext.nexttechnosolutions.com/media/template_images/web.png" width="45" height="45"/></td>
                  <td width="94%"><span style="font-size: 14px; color: #429be1">Apply Here</span><br>
                    <span style="font-size: 18px;font-weight: 500">www.nexttechnosolutions.com</span></td></tr>
                  <tr><td width="4%">&nbsp;</td></tr>
               
              
          </table></td>
        </tr>
       
        <tr>
          <td height="673" colspan="2" rowspan="5" valign="top"><p><span style=" font-size:80px; color:#000; font-weight: 500; text-align: center" >Who we are</span><br>
            <span style="font-size:16px; color:#000; text-align: justify;">NEXT Inc, a pioneer in Digital Revolution,sets itself apart through solutions that are 
              synonymous of digital transformation, innovation  and value delivery across different industrial streams and verticals. We are committed to delivering solutions that 
              are futuristic and ensure assured returns to our Customers, Stakeholders, Technology Partners and Employees. structure Solutions 
              to our valued client base. Our Digital Enterprise Solutions and Digital  Infrastructure Solutions can enable, empower and energize the drive for 
          effective solutions in upcoming generations.</span></p></td>
          
          <td width="29%" height="300" align="right" ><span style="font-size: 20px; color:#fff; padding-top: 260px"><b>NEXT Techno Enterprises PVT LTD</b><br>
             Module No: 308/1, Third Floor<br>ELCOT IT/ITES-SEZ,TIDEL PARK<br>Coimbatore - 641 014<br>Tamil Nadu.<br>+91 422-2971111/1112/1113</span></td>
        </tr>
        
        <tr>
          <td colspan="3" align="right">&nbsp;</td>
        </tr>
      </tbody>
    </table>
                </body>
</html>
"""       
