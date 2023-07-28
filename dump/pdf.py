## pip install reportlab

from reportlab.pdfgen import canvas

def generate_pdf():
    # Create the canvas
    c = canvas.Canvas("example.pdf")

    # Draw some shapes and text
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, "Hello,")
    c.drawString(100, 700, "This is an example PDF generated in Python!")
    c.drawString(100, 650, "Regards,")
    c.drawString(100, 600, "Your Name")

    # Save the canvas contents
    c.save()

# Generate the PDF
generate_pdf()