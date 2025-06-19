FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite ssl headers

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache for PWA
RUN echo '<Directory /var/www/html>' >> /etc/apache2/apache2.conf && \
    echo '    Options Indexes FollowSymLinks' >> /etc/apache2/apache2.conf && \
    echo '    AllowOverride All' >> /etc/apache2/apache2.conf && \
    echo '    Require all granted' >> /etc/apache2/apache2.conf && \
    echo '</Directory>' >> /etc/apache2/apache2.conf

# Add proper MIME types for PWA
RUN echo 'AddType application/manifest+json .webmanifest' >> /etc/apache2/apache2.conf && \
    echo 'AddType application/manifest+json .json' >> /etc/apache2/apache2.conf && \
    echo 'AddType text/cache-manifest .appcache' >> /etc/apache2/apache2.conf

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
