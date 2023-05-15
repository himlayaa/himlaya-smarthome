package com.example.mpdemo.entity;

public class City {

    private String city_id;
    private String name;
    private String longitude;
    private String latitude;

    public City(String city_id, String name, String longitude, String latitude) {
        this.city_id = city_id;
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public String getCity_id() {
        return city_id;
    }

    public void setCity_id(String city_id) {
        this.city_id = city_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    @Override
    public String toString() {
        return "City{" +
                "city_id='" + city_id + '\'' +
                ", name='" + name + '\'' +
                ", longitude='" + longitude + '\'' +
                ", latitude='" + latitude + '\'' +
                '}';
    }
}
